/**
 * CertificationRepository - Accès aux données de certification
 */

const fs = require('fs').promises;
const path = require('path');
const Certification = require('../models/Certification');

const DATA_DIR = path.join(__dirname, '../../../data');
const CERTIFICATIONS_FILE = path.join(DATA_DIR, 'certifications.json');

let certificationsCache = null;
let isLoaded = false;

async function loadData() {
  if (isLoaded) return;
  
  try {
    const data = await fs.readFile(CERTIFICATIONS_FILE, 'utf-8');
    certificationsCache = JSON.parse(data);
  } catch {
    certificationsCache = { certifications: [], metadata: { total: 0, last_updated: null } };
    await saveData();
  }
  
  isLoaded = true;
}

async function saveData() {
  await fs.writeFile(CERTIFICATIONS_FILE, JSON.stringify(certificationsCache, null, 2));
}

class CertificationRepository {
  
  async findById(id) {
    await loadData();
    const data = certificationsCache.certifications.find(c => c.id === id);
    return data ? new Certification(data) : null;
  }
  
  async findByMemberId(memberId) {
    await loadData();
    const data = certificationsCache.certifications.filter(c => c.member_id === memberId);
    return data.map(c => new Certification(c));
  }
  
  async findPending(filters = {}) {
    await loadData();
    let certs = certificationsCache.certifications.filter(c => c.status === 'pending');
    
    if (filters.level) {
      certs = certs.filter(c => c.level === filters.level);
    }
    
    return certs.map(c => new Certification(c));
  }
  
  async findAll(filters = {}) {
    await loadData();
    let certs = certificationsCache.certifications;
    
    if (filters.status) {
      certs = certs.filter(c => c.status === filters.status);
    }
    if (filters.level) {
      certs = certs.filter(c => c.level === filters.level);
    }
    if (filters.member_id) {
      certs = certs.filter(c => c.member_id === filters.member_id);
    }
    
    const limit = parseInt(filters.limit) || 100;
    const offset = parseInt(filters.offset) || 0;
    const total = certs.length;
    const paginated = certs.slice(offset, offset + limit);
    
    return {
      certifications: paginated.map(c => new Certification(c)),
      total,
      limit,
      offset
    };
  }
  
  async create(data) {
    await loadData();
    
    const certification = new Certification(data);
    certificationsCache.certifications.push(certification.toJSON());
    certificationsCache.metadata.total = certificationsCache.certifications.length;
    certificationsCache.metadata.last_updated = new Date().toISOString();
    
    await saveData();
    return certification;
  }
  
  async update(id, updateData) {
    await loadData();
    
    const index = certificationsCache.certifications.findIndex(c => c.id === id);
    if (index === -1) return null;
    
    const current = certificationsCache.certifications[index];
    const updated = {
      ...current,
      ...updateData,
      updated_at: new Date().toISOString()
    };
    
    certificationsCache.certifications[index] = updated;
    certificationsCache.metadata.last_updated = new Date().toISOString();
    
    await saveData();
    return new Certification(updated);
  }
  
  async approve(id, validatorId, notes = '') {
    const cert = await this.findById(id);
    if (!cert) return null;
    
    return this.update(id, {
      status: 'approved',
      validated_by: validatorId,
      validated_at: new Date().toISOString(),
      validation_notes: notes,
      expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      metadata: {
        ...cert.metadata,
        reviewer_comments: notes,
        reviewed_at: new Date().toISOString()
      }
    });
  }
  
  async reject(id, validatorId, reason = '') {
    return this.update(id, {
      status: 'rejected',
      validated_by: validatorId,
      validated_at: new Date().toISOString(),
      validation_notes: reason,
      metadata: {
        reviewer_comments: reason,
        reviewed_at: new Date().toISOString()
      }
    });
  }
  
  async getStats() {
    await loadData();
    const certs = certificationsCache.certifications;
    
    return {
      total: certs.length,
      pending: certs.filter(c => c.status === 'pending').length,
      approved: certs.filter(c => c.status === 'approved').length,
      rejected: certs.filter(c => c.status === 'rejected').length,
      by_level: {
        apprentice: certs.filter(c => c.level === 'apprentice' && c.status === 'approved').length,
        confirmed: certs.filter(c => c.level === 'confirmed' && c.status === 'approved').length,
        expert: certs.filter(c => c.level === 'expert' && c.status === 'approved').length,
        master: certs.filter(c => c.level === 'master' && c.status === 'approved').length
      }
    };
  }
}

module.exports = new CertificationRepository();
