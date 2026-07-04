/**
 * MemberValidator - Validation des données des membres
 */

const PhoneValidator = require('./PhoneValidator');
const IdentityValidator = require('./IdentityValidator');
const LocationValidator = require('./LocationValidator');
const ProfessionalValidator = require('./ProfessionalValidator');

function validateMember(data) {
  const errors = [];
  
  // Si le payload vient directement comme 'data' mais attend les sous-objets, 
  // on adapte (selon la structure définie dans les validateurs)
  
  // Validation Identité (attend data.first_name, etc. ou data.profile.identity)
  const identityData = data.profile?.identity || data;
  const identityErrors = IdentityValidator.validate(identityData);
  errors.push(...identityErrors);
  
  // Validation Téléphone
  const phone = data.profile?.identity?.phone || data.phone;
  const phoneErrors = PhoneValidator.validate(phone);
  errors.push(...phoneErrors);
  
  // Validation Localisation
  const locationData = data.profile?.location || data;
  const locationErrors = LocationValidator.validate(locationData);
  errors.push(...locationErrors);
  
  // Validation Professionnel
  const professionalData = data.profile?.professional || data;
  const professionalErrors = ProfessionalValidator.validate(professionalData);
  errors.push(...professionalErrors);
  
  return {
    valid: errors.length === 0,
    errors
  };
}

function validateId(id) {
  return id && id.startsWith('ant_');
}

module.exports = {
  validateMember,
  validateId
};
