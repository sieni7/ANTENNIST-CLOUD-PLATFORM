/**
 * CertificationService - Logique métier de certification
 */

const CertificationRepository = require('../repositories/CertificationRepository');
const MemberRepository = require('../repositories/MemberRepository');
const AuditService = require('./AuditService');
const Logger = require('../utils/Logger');
const Certification = require('../models/Certification');
const NotificationService = require('../services/NotificationService');

class CertificationService {
  constructor() {
    this.certRepo = CertificationRepository;
    this.memberRepo = MemberRepository;
    this.audit = AuditService;
  }
  
  // ===== DEMANDE DE CERTIFICATION =====
  async requestCertification(memberId, data, requester = 'system') {
    Logger.info(`CertificationService.requestCertification: ${memberId}`);
    
    const member = await this.memberRepo.findById(memberId);
    if (!member) {
      throw new Error('Membre non trouvé');
    }
    
    // Vérifier s'il y a déjà une demande en cours
    const existing = await this.certRepo.findByMemberId(memberId);
    const pending = existing.filter(c => c.isPending());
    if (pending.length > 0) {
      throw new Error('Une demande de certification est déjà en cours');
    }
    
    // Déterminer le niveau automatiquement en fonction de l'expérience
    const experienceYears = member.profile?.professional?.experience_years || 0;
    let suggestedLevel = 'apprentice';
    if (experienceYears >= 10) suggestedLevel = 'master';
    else if (experienceYears >= 5) suggestedLevel = 'expert';
    else if (experienceYears >= 2) suggestedLevel = 'confirmed';
    
    const level = data.level || suggestedLevel;
    
    // Créer la demande
    const certification = await this.certRepo.create({
      member_id: memberId,
      fita_number: member.fita_number,
      level: level,
      status: 'pending',
      metadata: {
        requester: requester,
        requested_level: level,
        auto_level: data.level ? false : true,
        experience_years: experienceYears
      }
    });
    
    // Audit
    await this.audit.log({
      entity_id: memberId,
      entity_type: 'member',
      action: 'CERTIFICATION_REQUEST',
      actor: requester,
      data: { certification_id: certification.id, level: certification.level }
    });
    
    Logger.info(`CertificationService.requestCertification: OK - ${certification.id}`);
    
    return certification;
  }
  
  // ===== APPROUVER =====
  async approveCertification(certId, validatorId, notes = '') {
    Logger.info(`CertificationService.approveCertification: ${certId}`);
    
    const cert = await this.certRepo.findById(certId);
    if (!cert) {
      throw new Error('Demande de certification non trouvée');
    }
    
    if (!cert.isPending()) {
      throw new Error('Cette demande n\'est plus en attente');
    }
    
    // Approuver
    const approved = await this.certRepo.approve(certId, validatorId, notes);
    
    // Mettre à jour le membre
    const member = await this.memberRepo.findById(cert.member_id);
    if (member) {
      await this.memberRepo.update(member._id, {
        system: {
          status: {
            state: 'certified',
            certified: true
          }
        },
        certification: {
          level: cert.level,
          certified_at: new Date().toISOString(),
          validated_by: validatorId,
          certificate_url: `/certificates/${cert.fita_number}.pdf`
        },
        membership: {
          plan: cert.level === 'master' ? 'expert' : cert.level === 'expert' ? 'pro' : 'basic',
          status: 'active',
          start_date: new Date().toISOString(),
          expiry_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
        }
      });
    }
    
    // Audit
    await this.audit.log({
      entity_id: cert.member_id,
      entity_type: 'member',
      action: 'CERTIFICATION_APPROVED',
      actor: validatorId,
      data: { 
        certification_id: certId, 
        level: cert.level,
        notes: notes
      }
    });
    
    Logger.info(`CertificationService.approveCertification: OK - ${certId}`);
    
    // Send notification
    try {
      await NotificationService.notifyCertificationApproved(member, cert.level);
    } catch (err) {
      Logger.warn(`Notification failed: ${err.message}`);
    }
    
    return approved;
  }
  
  // ===== REJETER =====
  async rejectCertification(certId, validatorId, reason = '') {
    Logger.info(`CertificationService.rejectCertification: ${certId}`);
    
    const cert = await this.certRepo.findById(certId);
    if (!cert) {
      throw new Error('Demande de certification non trouvée');
    }
    
    if (!cert.isPending()) {
      throw new Error('Cette demande n\'est plus en attente');
    }
    
    const rejected = await this.certRepo.reject(certId, validatorId, reason);
    
    // Audit
    await this.audit.log({
      entity_id: cert.member_id,
      entity_type: 'member',
      action: 'CERTIFICATION_REJECTED',
      actor: validatorId,
      data: { 
        certification_id: certId, 
        reason: reason
      }
    });
    // Fetch member for notification
    const member = await this.memberRepo.findById(cert.member_id);
    if (member) {
      try {
        await NotificationService.notifyCertificationRejected(member, reason);
      } catch (err) {
        Logger.warn(`Notification failed: ${err.message}`);
      }
    }
    Logger.info(`CertificationService.rejectCertification: OK - ${certId}`);
    
    return rejected;
  }
  
  // ===== LISTE DES DEMANDES =====
  async getPendingRequests(filters = {}) {
    return this.certRepo.findPending(filters);
  }
  
  // ===== STATISTIQUES =====
  async getStats() {
    return this.certRepo.getStats();
  }
  
  // ===== VÉRIFICATION D'ÉLIGIBILITÉ =====
  async checkEligibility(memberId) {
    const member = await this.memberRepo.findById(memberId);
    if (!member) {
      return { eligible: false, reasons: ['Membre non trouvé'] };
    }
    
    const reasons = [];
    const requirements = {
      identity: !!(member.profile?.identity?.first_name && member.profile?.identity?.last_name),
      phone: !!(member.profile?.identity?.phone),
      specialties: !!(member.profile?.professional?.specialties && member.profile?.professional?.specialties.length > 0),
      location: !!(member.profile?.location?.city && member.profile?.location?.region),
      photo: !!(member.profile?.media?.photo)
    };
    
    Object.keys(requirements).forEach(key => {
      if (!requirements[key]) {
        reasons.push(`Champ manquant: ${key}`);
      }
    });
    
    return {
      eligible: reasons.length === 0,
      reasons,
      requirements,
      current_level: member.certification?.level || null,
      suggested_level: this.suggestLevel(member)
    };
  }
  
  suggestLevel(member) {
    const years = member.profile?.professional?.experience_years || 0;
    const specialties = member.profile?.professional?.specialties || [];
    const equipment = member.profile?.professional?.equipment || [];
    
    let score = 0;
    if (years >= 2) score += 1;
    if (years >= 5) score += 1;
    if (years >= 10) score += 1;
    if (specialties.length >= 3) score += 1;
    if (equipment.length >= 5) score += 1;
    
    if (score >= 4) return 'master';
    if (score >= 3) return 'expert';
    if (score >= 2) return 'confirmed';
    return 'apprentice';
  }
}

module.exports = new CertificationService();
