/**
 * MemberService - Logique métier des membres
 */

const MemberRepository = require('../repositories/MemberRepository');
const SequenceRepository = require('../repositories/SequenceRepository');
const AuditService = require('./AuditService');
const Logger = require('../utils/Logger');
const { validateMember, validateId } = require('../validators/MemberValidator');

class MemberService {
  constructor() {
    this.repo = MemberRepository;
    this.sequence = SequenceRepository;
    this.audit = AuditService;
  }
  
  // ===== READ =====
  async getMember(id) {
    Logger.debug(`MemberService.getMember: ${id}`);
    
    const member = await this.repo.findById(id);
    if (!member) {
      throw new Error('Membre non trouvé');
    }
    
    // Incrémenter les vues
    await this.repo.incrementStat(id, 'views');
    
    return member;
  }
  
  async listMembers(filters = {}) {
    Logger.debug(`MemberService.listMembers: ${JSON.stringify(filters)}`);
    return this.repo.findAll(filters);
  }
  
  // ===== CREATE =====
  async createMember(data) {
    Logger.info(`MemberService.createMember: ${data.first_name || data.profile?.identity?.first_name} ${data.last_name || data.profile?.identity?.last_name}`);
    
    // Validation
    const validation = validateMember(data);
    if (!validation.valid) {
      throw new Error(validation.errors.join(', '));
    }
    
    // Générer le numéro FITA
    const fitaNumber = await this.sequence.getNextNumber('ant');
    
    // Si les données sont plates, on les map vers le profile (pour compatibilité MVP -> V1)
    let memberData = data;
    if (!data.profile) {
      memberData = {
        profile: {
          identity: {
            first_name: data.first_name || '',
            last_name: data.last_name || '',
            phone: data.phone || '',
            whatsapp: data.whatsapp || '',
            email: data.email || ''
          },
          professional: {
            specialties: data.specialties || [],
            experience_years: data.experience_years || 0,
            description: data.description || '',
            equipment: data.equipment || []
          },
          location: {
            city: data.city || '',
            region: data.region || '',
            lat: data.lat || null,
            lng: data.lng || null,
            address: data.address || ''
          }
        }
      };
    }
    
    // Créer le membre
    const member = await this.repo.create({
      ...memberData,
      fita_number: fitaNumber,
      system: {
        status: { state: 'referenced' }
      }
    });
    
    // Audit
    await this.audit.log({
      entity_id: member._id,
      entity_type: 'member',
      action: 'CREATE',
      actor: data.created_by || 'system',
      data: { fita_number: member.fita_number }
    });
    
    Logger.info(`MemberService.createMember: OK - ${member.fita_number}`);
    
    return member;
  }
  
  // ===== UPDATE =====
  async updateMember(id, data, actor = 'system') {
    Logger.info(`MemberService.updateMember: ${id}`);
    
    if (!validateId(id)) {
      throw new Error('ID invalide');
    }
    
    // Vérifier l'existence
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new Error('Membre non trouvé');
    }
    
    // Audit du changement
    const auditEntry = {
      entity_id: id,
      entity_type: 'member',
      action: 'UPDATE',
      actor: actor,
      data: { changes: data }
    };
    
    // Mettre à jour
    const updated = await this.repo.update(id, {
      ...data,
      audit: [auditEntry]
    });
    
    if (!updated) {
      throw new Error('Erreur lors de la mise à jour');
    }
    
    await this.audit.log(auditEntry);
    
    Logger.info(`MemberService.updateMember: OK - ${id}`);
    
    return updated;
  }
  
  // ===== DELETE =====
  async deleteMember(id, actor = 'system') {
    Logger.info(`MemberService.deleteMember: ${id}`);
    
    if (!validateId(id)) {
      throw new Error('ID invalide');
    }
    
    const deleted = await this.repo.delete(id);
    if (!deleted) {
      throw new Error('Membre non trouvé');
    }
    
    await this.audit.log({
      entity_id: id,
      entity_type: 'member',
      action: 'DELETE',
      actor: actor,
      data: { soft_delete: true }
    });
    
    Logger.info(`MemberService.deleteMember: OK - ${id}`);
    
    return true;
  }
  
  // ===== VALIDATION =====
  async validateMember(data) {
    return validateMember(data);
  }
  
  // ===== CERTIFICATION =====
  async certifyMember(id, level, validatorId) {
    Logger.info(`MemberService.certifyMember: ${id} → ${level}`);
    
    const member = await this.repo.findById(id);
    if (!member) {
      throw new Error('Membre non trouvé');
    }
    
    const updated = await this.repo.update(id, {
      certification: {
        level: level,
        certified_at: new Date().toISOString(),
        validated_by: validatorId
      },
      system: {
        status: {
          state: 'certified',
          certified: true
        }
      }
    });
    
    await this.audit.log({
      entity_id: id,
      entity_type: 'member',
      action: 'CERTIFY',
      actor: validatorId,
      data: { level, certified_at: new Date().toISOString() }
    });
    
    Logger.info(`MemberService.certifyMember: OK - ${id} certifié ${level}`);
    
    return updated;
  }
}

module.exports = new MemberService();
