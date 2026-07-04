/**
 * PhoneValidator - Validation des numéros de téléphone
 */

function validate(phone) {
  const errors = [];
  
  if (!phone) {
    errors.push('Le numéro de téléphone est requis');
    return errors;
  }
  
  // Format: +225 07 08 12 34 56 ou 0708123456
  const phoneRegex = /^(?:\+225|0)[0-9]{8,10}$/;
  if (!phoneRegex.test(phone)) {
    errors.push('Format de téléphone invalide (ex: +2250708123456 ou 0708123456)');
  }
  
  return errors;
}

function sanitize(phone) {
  if (!phone) return '';
  return phone.replace(/\s/g, '');
}

function normalize(phone) {
  if (!phone) return '';
  const cleaned = sanitize(phone);
  if (cleaned.startsWith('0')) {
    return `+225${cleaned.substring(1)}`;
  }
  if (!cleaned.startsWith('+225')) {
    return `+225${cleaned}`;
  }
  return cleaned;
}

module.exports = {
  validate,
  sanitize,
  normalize
};
