/**
 * NotificationRepository - Accès aux données de notification
 */

const fs = require('fs').promises;
const path = require('path');
const Notification = require('../models/Notification');

const DATA_DIR = path.join(__dirname, '../../../data');
const NOTIFICATIONS_FILE = path.join(DATA_DIR, 'notifications.json');

let notificationsCache = null;
let isLoaded = false;

async function loadData() {
  if (isLoaded) return;
  
  try {
    const data = await fs.readFile(NOTIFICATIONS_FILE, 'utf-8');
    notificationsCache = JSON.parse(data);
  } catch {
    notificationsCache = { notifications: [], metadata: { total: 0, last_updated: null } };
    await saveData();
  }
  
  isLoaded = true;
}

async function saveData() {
  await fs.writeFile(NOTIFICATIONS_FILE, JSON.stringify(notificationsCache, null, 2));
}

class NotificationRepository {
  
  async findById(id) {
    await loadData();
    const data = notificationsCache.notifications.find(n => n.id === id);
    return data ? new Notification(data) : null;
  }
  
  async findByRecipient(recipientId, filters = {}) {
    await loadData();
    let notifs = notificationsCache.notifications.filter(n => n.recipient_id === recipientId);
    
    if (filters.channel) {
      notifs = notifs.filter(n => n.channel === filters.channel);
    }
    if (filters.event) {
      notifs = notifs.filter(n => n.event === filters.event);
    }
    if (filters.status) {
      notifs = notifs.filter(n => n.status === filters.status);
    }
    
    const limit = parseInt(filters.limit) || 50;
    const offset = parseInt(filters.offset) || 0;
    const total = notifs.length;
    const paginated = notifs.slice(offset, offset + limit);
    
    return {
      notifications: paginated.map(n => new Notification(n)),
      total,
      limit,
      offset
    };
  }
  
  async findPending(limit = 10) {
    await loadData();
    const pending = notificationsCache.notifications
      .filter(n => n.status === 'pending')
      .slice(0, limit);
    
    return pending.map(n => new Notification(n));
  }
  
  async create(data) {
    await loadData();
    
    const notification = new Notification(data);
    notificationsCache.notifications.push(notification.toJSON());
    notificationsCache.metadata.total = notificationsCache.notifications.length;
    notificationsCache.metadata.last_updated = new Date().toISOString();
    
    await saveData();
    return notification;
  }
  
  async update(id, updateData) {
    await loadData();
    
    const index = notificationsCache.notifications.findIndex(n => n.id === id);
    if (index === -1) return null;
    
    const current = notificationsCache.notifications[index];
    const updated = {
      ...current,
      ...updateData,
      updated_at: new Date().toISOString()
    };
    
    notificationsCache.notifications[index] = updated;
    notificationsCache.metadata.last_updated = new Date().toISOString();
    
    await saveData();
    return new Notification(updated);
  }
  
  async markSent(id, deliveryData = {}) {
    return this.update(id, {
      status: 'sent',
      sent_at: new Date().toISOString(),
      ...deliveryData
    });
  }
  
  async markDelivered(id) {
    return this.update(id, {
      status: 'delivered',
      delivered_at: new Date().toISOString()
    });
  }
  
  async markFailed(id, error) {
    const notif = await this.findById(id);
    if (!notif) return null;
    
    const attempts = notif.attempts + 1;
    const status = attempts >= notif.max_attempts ? 'failed' : 'pending';
    
    return this.update(id, {
      status,
      attempts,
      error: error || 'Échec de l\'envoi'
    });
  }
  
  async getStats(filters = {}) {
    await loadData();
    const notifs = notificationsCache.notifications;
    
    let filtered = notifs;
    if (filters.channel) {
      filtered = filtered.filter(n => n.channel === filters.channel);
    }
    if (filters.event) {
      filtered = filtered.filter(n => n.event === filters.event);
    }
    
    return {
      total: filtered.length,
      pending: filtered.filter(n => n.status === 'pending').length,
      sent: filtered.filter(n => n.status === 'sent').length,
      delivered: filtered.filter(n => n.status === 'delivered').length,
      failed: filtered.filter(n => n.status === 'failed').length,
      by_channel: {
        whatsapp: filtered.filter(n => n.channel === 'whatsapp').length,
        email: filtered.filter(n => n.channel === 'email').length,
        sms: filtered.filter(n => n.channel === 'sms').length
      }
    };
  }
}

module.exports = new NotificationRepository();
