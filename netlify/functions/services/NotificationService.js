/**
 * NotificationService - Gestion centralisée des notifications
 */

const NotificationRepository = require('../repositories/NotificationRepository');
const MemberRepository = require('../repositories/MemberRepository'); // Needed for processing pending
const Logger = require('../utils/Logger');
const TEMPLATES = require('../config/templates');

// Services externes (simulés pour le MVP)
// En production, remplacer par les vrais clients
const WhatsAppService = {
  send: async (to, message) => {
    Logger.info(`[WhatsApp] Sending to ${to}: ${message.substring(0, 50)}...`);
    // Simuler un envoi
    return { success: true, message_id: `wa_${Date.now()}` };
  }
};

const EmailService = {
  send: async (to, subject, html) => {
    Logger.info(`[Email] Sending to ${to}: ${subject}`);
    // Simuler un envoi
    return { success: true, message_id: `email_${Date.now()}` };
  }
};

const SMSService = {
  send: async (to, message) => {
    Logger.info(`[SMS] Sending to ${to}: ${message.substring(0, 50)}...`);
    // Simuler un envoi
    return { success: true, message_id: `sms_${Date.now()}` };
  }
};

class NotificationService {
  constructor() {
    this.repo = NotificationRepository;
    this.channels = {
      whatsapp: WhatsAppService,
      email: EmailService,
      sms: SMSService
    };
  }
  
  // ===== ENVOI =====
  async send(recipient, event, data = {}) {
    Logger.info(`NotificationService.send: ${event} → ${recipient.phone || recipient.email}`);
    
    // Récupérer le template
    const template = TEMPLATES[event];
    if (!template) {
      throw new Error(`Template inconnu: ${event}`);
    }
    
    // Déterminer le canal
    const channel = recipient.preferred_channel || 'whatsapp';
    const channelTemplate = template[channel];
    if (!channelTemplate) {
      throw new Error(`Canal non supporté: ${channel}`);
    }
    
    // Préparer les données
    const notificationData = {
      recipient_id: recipient._id,
      recipient_phone: recipient.phone,
      recipient_email: recipient.email,
      channel: channel,
      event: event,
      template: event,
      metadata: data
    };
    
    // Construire le message
    const subject = typeof channelTemplate.subject === 'function' 
      ? channelTemplate.subject(data) 
      : channelTemplate.subject;
    
    const body = typeof channelTemplate.body === 'function'
      ? channelTemplate.body(data)
      : channelTemplate.body;
    
    notificationData.subject = subject;
    notificationData.body = body;
    
    // Créer la notification
    const notification = await this.repo.create(notificationData);
    
    // Envoyer
    try {
      const result = await this.sendViaChannel(channel, recipient, subject, body);
      await this.repo.markSent(notification.id, { message_id: result.message_id });
      Logger.info(`NotificationService.send: OK - ${notification.id}`);
      return notification;
    } catch (error) {
      await this.repo.markFailed(notification.id, error.message);
      Logger.error(`NotificationService.send: FAILED - ${error.message}`);
      throw error;
    }
  }
  
  async sendViaChannel(channel, recipient, subject, body) {
    const service = this.channels[channel];
    if (!service) {
      throw new Error(`Service non disponible: ${channel}`);
    }
    
    if (channel === 'whatsapp' || channel === 'sms') {
      const to = recipient.phone || recipient.whatsapp;
      if (!to) throw new Error('Numéro de téléphone manquant');
      return service.send(to, body);
    }
    
    if (channel === 'email') {
      const to = recipient.email;
      if (!to) throw new Error('Email manquant');
      return service.send(to, subject, body);
    }
    
    throw new Error(`Canal non supporté: ${channel}`);
  }
  
  // ===== RÉCUPÉRATION =====
  async getNotifications(recipientId, filters = {}) {
    return this.repo.findByRecipient(recipientId, filters);
  }
  
  async getPending(limit = 10) {
    return this.repo.findPending(limit);
  }
  
  async getStats(filters = {}) {
    return this.repo.getStats(filters);
  }
  
  // ===== PROCESSUS BATCH =====
  async processPending(limit = 10) {
    const pending = await this.repo.findPending(limit);
    const results = [];
    
    for (const notif of pending) {
      try {
        // Récupérer le destinataire
        const member = await MemberRepository.findById(notif.recipient_id);
        if (!member) {
          await this.repo.markFailed(notif.id, 'Destinataire introuvable');
          continue;
        }
        
        // Réessayer l'envoi
        const recipient = {
          _id: member._id,
          phone: member.profile.identity.phone,
          email: member.profile.identity.email,
          whatsapp: member.profile.identity.whatsapp,
          preferred_channel: member.preferences?.notifications?.preferred || 'whatsapp'
        };
        
        const result = await this.sendViaChannel(
          notif.channel,
          recipient,
          notif.subject,
          notif.body
        );
        
        await this.repo.markSent(notif.id, { message_id: result.message_id });
        results.push({ id: notif.id, status: 'sent' });
        
      } catch (error) {
        await this.repo.markFailed(notif.id, error.message);
        results.push({ id: notif.id, status: 'failed', error: error.message });
      }
    }
    
    return results;
  }
  
  // ===== ÉVÉNEMENTS =====
  async notifyCertificationApproved(member, level) {
    const data = {
      first_name: member.profile.identity.first_name,
      last_name: member.profile.identity.last_name,
      level: level,
      fita_number: member.fita_number,
      date: new Date().toISOString(),
      profile_url: `${process.env.APP_URL || 'https://antennist-cloud-platform.netlify.app'}/profil.html?id=${member._id}`,
      short_url: `${process.env.APP_URL || 'https://antennist-cloud-platform.netlify.app'}/p/${member.fita_number}`
    };
    
    return this.send(member, 'certification_approved', data);
  }
  
  async notifyCertificationRejected(member, reason) {
    const data = {
      first_name: member.profile.identity.first_name,
      last_name: member.profile.identity.last_name,
      reason: reason || 'Non conforme aux critères FITA',
      fita_number: member.fita_number,
      profile_url: `${process.env.APP_URL || 'https://antennist-cloud-platform.netlify.app'}/profil.html?id=${member._id}`
    };
    
    return this.send(member, 'certification_rejected', data);
  }
  
  async notifyWelcome(member) {
    const data = {
      first_name: member.profile.identity.first_name,
      last_name: member.profile.identity.last_name,
      phone: member.profile.identity.phone,
      fita_number: member.fita_number,
      profile_url: `${process.env.APP_URL || 'https://antennist-cloud-platform.netlify.app'}/profil.html?id=${member._id}`
    };
    
    return this.send(member, 'welcome', data);
  }
  
  async notifyMembershipRenewal(member) {
    const data = {
      first_name: member.profile.identity.first_name,
      last_name: member.profile.identity.last_name,
      expiry_date: member.membership.expiry_date,
      fita_number: member.fita_number,
      profile_url: `${process.env.APP_URL || 'https://antennist-cloud-platform.netlify.app'}/profil.html?id=${member._id}`
    };
    
    return this.send(member, 'membership_renewal', data);
  }
}

module.exports = new NotificationService();
