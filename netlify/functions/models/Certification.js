/**
 * Certification - Modèle de certification FITA
 */

class Certification {
  constructor(data = {}) {
    this.id = data.id || `cert_${Date.now()}`;
    this.member_id = data.member_id || null;
    this.fita_number = data.fita_number || null;
    
    // Niveau de certification
    this.level = data.level || null; // 'apprentice' | 'confirmed' | 'expert' | 'master'
    
    // Statut
    this.status = data.status || 'pending'; // 'pending' | 'approved' | 'rejected'
    
    // Validation
    this.validated_by = data.validated_by || null;
    this.validated_at = data.validated_at || null;
    this.validation_notes = data.validation_notes || '';
    
    // Documents validés
    this.documents_validated = data.documents_validated || {
      identity: false,
      phone: false,
      specialties: false,
      experience: false,
      equipment: false,
      photo: false,
      cni: false
    };
    
    // Compétences validées
    this.skills_validated = data.skills_validated || {
      signal_analysis: false,
      frequency_finding: false,
      quality_optimization: false,
      dish_installation: false,
      antenna_alignment: false,
      collective_installation: false,
      troubleshooting: false,
      emergency_repair: false,
      lnb_polarization: false,
      cable_diagnostic: false
    };
    
    // Dates
    this.created_at = data.created_at || new Date().toISOString();
    this.updated_at = data.updated_at || new Date().toISOString();
    this.expires_at = data.expires_at || null; // 1 an après validation
    
    // Métadonnées
    this.metadata = data.metadata || {
      reviewer_comments: '',
      reviewed_at: null,
      review_duration: null // minutes
    };
  }
  
  isApproved() {
    return this.status === 'approved';
  }
  
  isPending() {
    return this.status === 'pending';
  }
  
  isRejected() {
    return this.status === 'rejected';
  }
  
  getLevelLabel() {
    const labels = {
      apprentice: 'Apprenti',
      confirmed: 'Confirmé',
      expert: 'Expert',
      master: 'Master'
    };
    return labels[this.level] || this.level;
  }
  
  getLevelBadge() {
    const badges = {
      apprentice: 'badge-warning',
      confirmed: 'badge-primary',
      expert: 'badge-success',
      master: 'badge-danger'
    };
    return badges[this.level] || 'badge-secondary';
  }
  
  toJSON() {
    return {
      id: this.id,
      member_id: this.member_id,
      fita_number: this.fita_number,
      level: this.level,
      status: this.status,
      validated_by: this.validated_by,
      validated_at: this.validated_at,
      validation_notes: this.validation_notes,
      documents_validated: this.documents_validated,
      skills_validated: this.skills_validated,
      created_at: this.created_at,
      updated_at: this.updated_at,
      expires_at: this.expires_at,
      metadata: this.metadata
    };
  }
}

module.exports = Certification;
