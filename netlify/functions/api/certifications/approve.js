/**
 * POST /api/certifications/:id/approve - Approuver une certification
 */

const CertificationService = require('../../../services/CertificationService');
const { success, badRequest, notFound, internalError, options } = require('../../../utils/Response');
const Logger = require('../../../utils/Logger');

exports.handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') return options();
  
  try {
    const id = event.path.split('/')[3];
    const { notes } = JSON.parse(event.body || '{}');
    const validatorId = event.headers['x-forwarded-for'] || 'moderator';
    
    if (!id) {
      return badRequest('ID de certification requis');
    }
    
    const certification = await CertificationService.approveCertification(id, validatorId, notes);
    
    if (!certification) {
      return notFound('Certification non trouvée');
    }
    
    return success({
      success: true,
      certification: certification.toJSON(),
      message: `Certification approuvée - Niveau: ${certification.level}`
    });
    
  } catch (error) {
    Logger.error(`CertificationApprove: ${error.message}`);
    
    if (error.message.includes('non trouvée')) {
      return notFound(error.message);
    }
    
    return badRequest(error.message);
  }
};
