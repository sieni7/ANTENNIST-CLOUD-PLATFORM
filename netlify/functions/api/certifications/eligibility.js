/**
 * GET /api/certifications/eligibility/:memberId - Vérifier l'éligibilité
 */

const CertificationService = require('../../../services/CertificationService');
const { success, badRequest, internalError, options } = require('../../../utils/Response');
const Logger = require('../../../utils/Logger');

exports.handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') return options();
  
  try {
    const memberId = event.path.split('/')[3];
    
    if (!memberId) {
      return badRequest('ID du membre requis');
    }
    
    const result = await CertificationService.checkEligibility(memberId);
    
    return success(result);
    
  } catch (error) {
    Logger.error(`CertificationEligibility: ${error.message}`);
    return internalError(error.message);
  }
};
