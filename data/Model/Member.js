/**
 * Modèle Member V0 - Antennist Cloud Platform
 *
 * Ce fichier documente le schéma de données d'un membre antenniste FITA.
 * Il sert de référence pour la validation et la création de membres.
 *
 * @version 0.0.1
 * @author FITA - DATA_LEAD
 */

const MemberModel = {
  // ─── Identifiant unique (généré automatiquement) ───────────────────────────
  _id: 'ant_1731234567890',            // timestamp-based ID

  // ─── Numéro FITA (format: ANT-2026-00001) ─────────────────────────────────
  fita_number: 'ANT-2026-00001',

  // ─── Identité ──────────────────────────────────────────────────────────────
  identity: {
    first_name: 'Jean',
    last_name:  'Kouadio',
    phone:      '+2250708123456',
    whatsapp:   '+2250708123456',
    email:      'jean@antennes.ci'
  },

  // ─── Localisation ──────────────────────────────────────────────────────────
  location: {
    city:    'Abidjan',
    region:  'lagunes',              // ID depuis regions.json
    lat:      5.359952,
    lng:     -3.982144,
    address: 'Cocody, Rue des Antennes'
  },

  // ─── Professionnel ─────────────────────────────────────────────────────────
  professional: {
    specialties:      ['tnt', 'satellite'], // IDs depuis specialties.json
    experience_years: 8,
    description:      'Expert en installation TNT et Satellite',
    equipment:        ['satfinder', 'testeur_signal']
  },

  // ─── Médias ────────────────────────────────────────────────────────────────
  media: {
    photo:    '/uploads/members/ant_1731234567890.jpg',
    qr_code:  '/qr/ANT-2026-00001.png'
  },

  // ─── Statut ────────────────────────────────────────────────────────────────
  status: {
    state:      'referenced',        // 'referenced' | 'verified' | 'certified'
    certified:   false,
    visible:     true,
    created_at: '2026-07-03T10:30:00Z',
    updated_at: '2026-07-03T14:20:00Z'
  },

  // ─── Statistiques ──────────────────────────────────────────────────────────
  stats: {
    views:         0,
    contacts:      0,
    interventions: 0,
    rating:        0
  }
};

module.exports = MemberModel;
