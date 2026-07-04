/**
 * GET /api/certifications/stats - Statistiques de certification
 */

const CertificationService = require('../../../services/CertificationService');
const { success, internalError, options } = require('../../../utils/Response');
const Logger = require('../../../utils/Logger');

exports.handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') return options();
  
  try {
    const stats = await CertificationService.getStats();
    
    return success({
      ...stats,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    Logger.error(`CertificationStats: ${error.message}`);
    return internalError(error.message);
  }
};
