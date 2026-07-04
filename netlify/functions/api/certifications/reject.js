/**
 * POST /api/certifications/:id/reject - Rejeter une certification
 */

const CertificationService = require('../../../services/CertificationService');
const { success, badRequest, notFound, internalError, options } = require('../../../utils/Response');
const Logger = require('../../../utils/Logger');

exports.handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') return options();
  
  try {
    const id = event.path.split('/')[3];
    const { reason } = JSON.parse(event.body || '{}');
    const validatorId = event.headers['x-forwarded-for'] || 'moderator';
    
    if (!id) {
      return badRequest('ID de certification requis');
    }
    
    const certification = await CertificationService.rejectCertification(id, validatorId, reason);
    
    if (!certification) {
      return notFound('Certification non trouvée');
    }
    
    return success({
      success: true,
      certification: certification.toJSON(),
      message: 'Certification rejetée'
    });
    
  } catch (error) {
    Logger.error(`CertificationReject: ${error.message}`);
    
    if (error.message.includes('non trouvée')) {
      return notFound(error.message);
    }
    
    return badRequest(error.message);
  }
};
