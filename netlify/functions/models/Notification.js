/**
 * Notification - Modèle de notification
 */

class Notification {
  constructor(data = {}) {
    this.id = data.id || `notif_${Date.now()}`;
    this.recipient_id = data.recipient_id || null; // member_id
    this.recipient_phone = data.recipient_phone || null;
    this.recipient_email = data.recipient_email || null;
    
    // Canal
    this.channel = data.channel || 'whatsapp'; // 'whatsapp' | 'email' | 'sms'
    
    // Type d'événement
    this.event = data.event || 'certification_approved'; 
    // certification_approved | certification_rejected | 
    // membership_renewal | welcome | reminder
    
    // Contenu
    this.template = data.template || null;
    this.subject = data.subject || '';
    this.body = data.body || '';
    this.metadata = data.metadata || {};
    
    // Statut
    this.status = data.status || 'pending'; // 'pending' | 'sent' | 'delivered' | 'failed'
    this.error = data.error || null;
    
    // Dates
    this.sent_at = data.sent_at || null;
    this.delivered_at = data.delivered_at || null;
    this.created_at = data.created_at || new Date().toISOString();
    this.updated_at = data.updated_at || new Date().toISOString();
    
    // Tentatives
    this.attempts = data.attempts || 0;
    this.max_attempts = data.max_attempts || 3;
  }
  
  isPending() {
    return this.status === 'pending';
  }
  
  isSent() {
    return this.status === 'sent' || this.status === 'delivered';
  }
  
  isFailed() {
    return this.status === 'failed';
  }
  
  canRetry() {
    return this.attempts < this.max_attempts && this.isFailed();
  }
  
  toJSON() {
    return {
      id: this.id,
      recipient_id: this.recipient_id,
      recipient_phone: this.recipient_phone,
      recipient_email: this.recipient_email,
      channel: this.channel,
      event: this.event,
      template: this.template,
      subject: this.subject,
      body: this.body,
      metadata: this.metadata,
      status: this.status,
      error: this.error,
      sent_at: this.sent_at,
      delivered_at: this.delivered_at,
      created_at: this.created_at,
      updated_at: this.updated_at,
      attempts: this.attempts,
      max_attempts: this.max_attempts
    };
  }
}

module.exports = Notification;
