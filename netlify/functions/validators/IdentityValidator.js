/**
 * IdentityValidator - Validation de l'identité
 */

function validate(data) {
  const errors = [];
  
  if (!data.first_name || data.first_name.trim().length < 2) {
    errors.push('Le prénom est requis (minimum 2 caractères)');
  }
  
  if (data.first_name && data.first_name.length > 50) {
    errors.push('Le prénom ne doit pas dépasser 50 caractères');
  }
  
  if (data.last_name && data.last_name.length > 50) {
    errors.push('Le nom ne doit pas dépasser 50 caractères');
  }
  
  return errors;
}

function sanitize(str) {
  if (!str) return '';
  return str.trim().replace(/[<>]/g, '');
}

module.exports = {
  validate,
  sanitize
};
