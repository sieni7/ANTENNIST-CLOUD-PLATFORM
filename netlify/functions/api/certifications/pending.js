/**
 * GET /api/certifications/pending - Liste des demandes en attente
 */

const CertificationService = require('../../../services/CertificationService');
const { success, internalError, options } = require('../../../utils/Response');
const Logger = require('../../../utils/Logger');

exports.handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') return options();
  
  try {
    const { level } = event.queryStringParameters || {};
    const pending = await CertificationService.getPendingRequests({ level });
    
    return success({
      certifications: pending.map(c => c.toJSON()),
      total: pending.length
    });
    
  } catch (error) {
    Logger.error(`CertificationPending: ${error.message}`);
    return internalError(error.message);
  }
};
