/**
 * Script d'initialisation des notifications
 * Crée le fichier notifications.json par défaut
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
const NOTIFICATIONS_FILE = path.join(DATA_DIR, 'notifications.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(NOTIFICATIONS_FILE)) {
  fs.writeFileSync(NOTIFICATIONS_FILE, JSON.stringify({
    notifications: [],
    metadata: {
      total: 0,
      last_updated: null,
      version: '1.0.0'
    }
  }, null, 2));
  console.log('✅ notifications.json créé');
} else {
  console.log('⚠️ notifications.json existe déjà');
}
