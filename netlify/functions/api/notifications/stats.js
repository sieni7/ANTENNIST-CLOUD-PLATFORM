/**
 * GET /api/notifications/stats - Statistiques des notifications
 */

const NotificationService = require('../../../services/NotificationService');
const { success, internalError, options } = require('../../../utils/Response');
const Logger = require('../../../utils/Logger');

exports.handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') return options();
  
  try {
    const { channel, event: eventType } = event.queryStringParameters || {};
    const stats = await NotificationService.getStats({ channel, event: eventType });
    
    return success({
      ...stats,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    Logger.error(`NotificationStats: ${error.message}`);
    return internalError(error.message);
  }
};
