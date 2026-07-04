/**
 * ProfessionalValidator - Validation des données professionnelles
 */

function validate(data) {
  const errors = [];
  
  if (!data.specialties || data.specialties.length === 0) {
    errors.push('Au moins une spécialité est requise');
  }
  
  if (data.specialties && data.specialties.length > 10) {
    errors.push('Maximum 10 spécialités autorisées');
  }
  
  if (data.experience_years !== undefined) {
    const years = parseInt(data.experience_years);
    if (isNaN(years) || years < 0 || years > 50) {
      errors.push('Années d\'expérience invalides (0-50)');
    }
  }
  
  if (data.equipment && data.equipment.length > 20) {
    errors.push('Maximum 20 équipements autorisés');
  }
  
  return errors;
}

module.exports = {
  validate
};
