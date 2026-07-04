/**
 * POST /api/notifications/process - Traiter les notifications en attente
 * (À exécuter périodiquement via cron ou webhook)
 */

const NotificationService = require('../../../services/NotificationService');
const { success, internalError, options } = require('../../../utils/Response');
const Logger = require('../../../utils/Logger');

exports.handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') return options();
  
  try {
    const { limit } = JSON.parse(event.body || '{}');
    const results = await NotificationService.processPending(limit || 10);
    
    return success({
      success: true,
      processed: results.length,
      results
    });
    
  } catch (error) {
    Logger.error(`NotificationProcess: ${error.message}`);
    return internalError(error.message);
  }
};
