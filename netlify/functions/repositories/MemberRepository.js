/**
 * MemberRepository - Accès aux données des membres
 */

const fs = require('fs').promises;
const path = require('path');
const Member = require('../models/Member');

const DATA_DIR = path.join(__dirname, '../../../data');
const MEMBERS_FILE = path.join(DATA_DIR, 'members.json');

// Cache en mémoire
let membersCache = null;
let isLoaded = false;

async function loadData() {
  if (isLoaded) return;
  
  try {
    const data = await fs.readFile(MEMBERS_FILE, 'utf-8');
    membersCache = JSON.parse(data);
  } catch {
    membersCache = { members: [], metadata: { total: 0, last_updated: null, version: '0.0.1' } };
    await saveData();
  }
  
  isLoaded = true;
}

async function saveData() {
  await fs.writeFile(MEMBERS_FILE, JSON.stringify(membersCache, null, 2));
}

class MemberRepository {
  
  // ===== FIND =====
  async findById(id) {
    await loadData();
    const data = membersCache.members.find(m => m._id === id);
    return data ? new Member(data) : null;
  }
  
  async findByFitaNumber(fitaNumber) {
    await loadData();
    const data = membersCache.members.find(m => m.fita_number === fitaNumber);
    return data ? new Member(data) : null;
  }
  
  async findAll(filters = {}) {
    await loadData();
    let members = membersCache.members;
    
    // Filtres
    if (filters.region) {
      members = members.filter(m => m.profile?.location?.region === filters.region);
    }
    if (filters.specialty) {
      members = members.filter(m => 
        m.profile?.professional?.specialties?.includes(filters.specialty)
      );
    }
    if (filters.status) {
      members = members.filter(m => m.system?.status?.state === filters.status);
    }
    if (filters.certified !== undefined) {
      members = members.filter(m => m.system?.status?.certified === filters.certified);
    }
    if (filters.visible !== undefined) {
      members = members.filter(m => m.system?.status?.visible === filters.visible);
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      members = members.filter(m => {
        const fullName = `${m.profile?.identity?.first_name || ''} ${m.profile?.identity?.last_name || ''}`.toLowerCase();
        return fullName.includes(searchLower) ||
               m.profile?.identity?.phone?.includes(filters.search) ||
               m.fita_number?.toLowerCase().includes(searchLower);
      });
    }
    
    // Pagination
    const limit = parseInt(filters.limit) || 100;
    const offset = parseInt(filters.offset) || 0;
    const total = members.length;
    const paginated = members.slice(offset, offset + limit);
    
    return {
      members: paginated.map(m => new Member(m)),
      total,
      limit,
      offset,
      metadata: membersCache.metadata
    };
  }
  
  // ===== CREATE =====
  async create(data) {
    await loadData();
    
    // Utiliser le modèle Member
    const member = new Member(data);
    
    // Ajouter à la liste
    membersCache.members.push(member.toJSON());
    membersCache.metadata.total = membersCache.members.length;
    membersCache.metadata.last_updated = new Date().toISOString();
    
    await saveData();
    
    return member;
  }
  
  // ===== UPDATE =====
  async update(id, updateData) {
    await loadData();
    
    const index = membersCache.members.findIndex(m => m._id === id);
    if (index === -1) return null;
    
    // Fusionner les données
    const current = membersCache.members[index];
    const updated = {
      ...current,
      ...updateData,
      system: {
        ...current.system,
        ...(updateData.system || {}),
        updated_at: new Date().toISOString()
      }
    };
    
    // Mettre à jour l'audit
    if (updateData.audit) {
      updated.audit = [...(current.audit || []), ...updateData.audit];
    }
    
    membersCache.members[index] = updated;
    membersCache.metadata.last_updated = new Date().toISOString();
    
    await saveData();
    
    return new Member(updated);
  }
  
  // ===== DELETE (Soft Delete) =====
  async delete(id) {
    await loadData();
    
    const index = membersCache.members.findIndex(m => m._id === id);
    if (index === -1) return false;
    
    membersCache.members[index].system.status.visible = false;
    membersCache.members[index].system.status.blocked = true;
    membersCache.members[index].system.updated_at = new Date().toISOString();
    membersCache.metadata.last_updated = new Date().toISOString();
    
    await saveData();
    
    return true;
  }
  
  // ===== STATS INCREMENT =====
  async incrementStat(id, field, value = 1) {
    await loadData();
    
    const index = membersCache.members.findIndex(m => m._id === id);
    if (index === -1) return false;
    
    if (membersCache.members[index].stats && 
        membersCache.members[index].stats[field] !== undefined) {
      membersCache.members[index].stats[field] += value;
      await saveData();
      return true;
    }
    
    return false;
  }
  
  // ===== CLEANUP =====
  async clearCache() {
    membersCache = null;
    isLoaded = false;
  }
}

module.exports = new MemberRepository();
