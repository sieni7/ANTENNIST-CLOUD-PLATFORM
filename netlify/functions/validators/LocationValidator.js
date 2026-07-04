/**
 * LocationValidator - Validation de la localisation
 */

const RegionRepository = require('../repositories/RegionRepository');

async function validate(data) {
  const errors = [];
  
  if (!data.city || data.city.trim().length < 2) {
    errors.push('La ville est requise');
  }
  
  if (!data.region) {
    errors.push('La région est requise');
  } else {
    // Vérifier que la région existe
    const regions = await RegionRepository.getLabels();
    const exists = regions.some(r => r.id === data.region);
    if (!exists) {
      errors.push('Région invalide');
    }
  }
  
  return errors;
}

function sanitizeCity(city) {
  if (!city) return '';
  return city.trim().replace(/[<>]/g, '');
}

module.exports = {
  validate,
  sanitizeCity
};
