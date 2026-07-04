/**
 * Constantes globales - Antennist Cloud Platform
 *
 * @version 0.0.1
 * @author FITA - TECH_LEAD
 */

module.exports = {
  APP_NAME:    'Antennist Cloud Platform',
  APP_VERSION: '0.0.1',

  // Dates
  DATE_FORMAT:     'YYYY-MM-DD',
  DATETIME_FORMAT: 'YYYY-MM-DDTHH:mm:ssZ',

  // FITA
  FITA_PREFIX:        'FITA',
  FITA_DOMAINS:       ['ANT', 'FO', 'STARLINK', 'CCTV', 'FIBRE'],
  FITA_DEFAULT_DOMAIN: 'ANT',

  // Statuts
  MEMBER_STATUSES:      ['draft', 'referenced', 'pending', 'verified', 'certified'],
  MEMBERSHIP_PLANS:     ['basic', 'pro', 'expert'],
  CERTIFICATION_LEVELS: ['apprentice', 'confirmed', 'expert', 'master'],

  // Régions
  REGIONS: [
    'Abidjan', 'Lagunes', 'Gbêkê', 'Poro', 'Tchologo',
    'Hambol', 'Nzi-Comoé', 'Indénié-Djuablin', 'Agneby-Tiassa',
    'Sud-Comoé', 'Cavally', 'Montagnes', 'Sassandra',
    'Bafing', 'Folon', 'Bagoué', 'Bélier', 'Jéréré',
    'Kabadougou', "M'bahiakro"
  ],

  // Spécialités
  SPECIALTIES: ['tnt', 'satellite', 'mixte', 'collective', 'depannage'],

  // Limites
  MAX_SPECIALTIES:  10,
  MAX_EQUIPMENT:    20,
  MAX_PHOTO_SIZE:   5 * 1024 * 1024, // 5MB
  MAX_SEARCH_RESULTS: 100,

  // Messages de réponse
  RESPONSE_MESSAGES: {
    CREATED:      'Membre créé avec succès',
    UPDATED:      'Membre mis à jour avec succès',
    DELETED:      'Membre désactivé avec succès',
    NOT_FOUND:    'Membre non trouvé',
    INVALID_DATA: 'Données invalides',
    UNAUTHORIZED: 'Non autorisé',
    FORBIDDEN:    'Accès interdit',
    SERVER_ERROR: 'Erreur interne du serveur'
  }
};
