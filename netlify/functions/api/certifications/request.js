/**
 * POST /api/certifications - Demander une certification
 */

const CertificationService = require('../../../services/CertificationService');
const { success, badRequest, internalError, options } = require('../../../utils/Response');
const Logger = require('../../../utils/Logger');

exports.handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') return options();
  
  try {
    const { member_id, level } = JSON.parse(event.body);
    const ip = event.headers['x-forwarded-for'] || 'system';
    
    if (!member_id) {
      return badRequest('ID du membre requis');
    }
    
    const certification = await CertificationService.requestCertification(
      member_id, 
      { level }, 
      ip
    );
    
    return success({
      success: true,
      certification: certification.toJSON(),
      status: 'pending',
      message: 'Demande de certification soumise avec succès'
    }, 201);
    
  } catch (error) {
    Logger.error(`CertificationRequest: ${error.message}`);
    return badRequest(error.message);
  }
};
