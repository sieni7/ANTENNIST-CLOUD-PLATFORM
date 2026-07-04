/**
 * Script d'initialisation des certifications
 * Crée le fichier certifications.json par défaut
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
const CERTIFICATIONS_FILE = path.join(DATA_DIR, 'certifications.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(CERTIFICATIONS_FILE)) {
  fs.writeFileSync(CERTIFICATIONS_FILE, JSON.stringify({
    certifications: [],
    metadata: {
      total: 0,
      last_updated: null,
      version: '1.0.0'
    }
  }, null, 2));
  console.log('✅ certifications.json créé');
} else {
  console.log('⚠️ certifications.json existe déjà');
}
