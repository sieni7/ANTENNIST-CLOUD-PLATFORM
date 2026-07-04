/**
 * Config.js - Configuration centralisée
 * Charge les variables d'environnement et expose la config globale
 *
 * @version 0.0.1
 * @author FITA - TECH_LEAD
 */

const fs   = require('fs');
const path = require('path');

// ─── Charger .env.local manuellement (dev local) ──────────────────────────────
function loadEnv() {
  const envPath = path.join(__dirname, '../../../.env.local');
  try {
    const env = fs.readFileSync(envPath, 'utf-8');
    env.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) return;
      const key   = trimmed.substring(0, eqIdx).trim();
      const value = trimmed.substring(eqIdx + 1).trim();
      if (key && !process.env[key]) {
        process.env[key] = value;
      }
    });
  } catch {
    // .env.local absent en production, c'est normal
  }
}

loadEnv();

const Config = {
  // ─── Environnement ───────────────────────────────────────────────────────────
  env:    process.env.NODE_ENV || 'development',
  isDev:  (process.env.NODE_ENV || 'development') === 'development',
  isProd: process.env.NODE_ENV === 'production',

  // ─── Netlify ─────────────────────────────────────────────────────────────────
  siteId:    process.env.NETLIFY_SITE_ID    || '',
  authToken: process.env.NETLIFY_AUTH_TOKEN || '',

  // ─── Supabase (Phase 2 - Réservé) ────────────────────────────────────────────
  supabase: {
    url:        process.env.SUPABASE_URL          || '',
    anonKey:    process.env.SUPABASE_ANON_KEY     || '',
    serviceKey: process.env.SUPABASE_SERVICE_KEY  || ''
  },

  // ─── Sécurité ────────────────────────────────────────────────────────────────
  jwtSecret:  process.env.JWT_SECRET  || 'antennist-cloud-secret-key-dev',
  adminEmail: process.env.ADMIN_EMAIL || 'admin@antennist.cloud',

  // ─── Limites ─────────────────────────────────────────────────────────────────
  limits: {
    maxMembers:       10000,
    maxUploadSize:    5 * 1024 * 1024, // 5MB
    maxSpecialties:   10,
    maxEquipment:     20,
    maxSearchResults: 100,
    rateLimit: {
      window: 60 * 1000, // 1 minute
      max:    100         // requêtes par fenêtre
    }
  },

  // ─── Chemins ─────────────────────────────────────────────────────────────────
  paths: {
    data:    path.join(__dirname, '../../../data'),
    uploads: path.join(__dirname, '../../../uploads'),
    public:  path.join(__dirname, '../../../public')
  },

  // ─── FITA ────────────────────────────────────────────────────────────────────
  fita: {
    domains:            ['ANT', 'FO', 'STARLINK', 'CCTV', 'FIBRE'],
    defaultDomain:      'ANT',
    certificationLevels: ['apprentice', 'confirmed', 'expert', 'master'],
    membershipPlans:    ['basic', 'pro', 'expert'],
    statuses:           ['draft', 'referenced', 'pending', 'verified', 'certified']
  }
};

module.exports = Config;
