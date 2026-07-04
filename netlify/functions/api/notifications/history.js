/**
 * GET /api/notifications/history/:memberId - Historique des notifications
 */

const NotificationService = require('../../../services/NotificationService');
const { success, badRequest, internalError, options } = require('../../../utils/Response');
const Logger = require('../../../utils/Logger');

exports.handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') return options();
  
  try {
    const memberId = event.path.split('/')[3];
    const { channel, event: eventType, status, limit, offset } = event.queryStringParameters || {};
    
    if (!memberId) {
      return badRequest('ID du membre requis');
    }
    
    const result = await NotificationService.getNotifications(memberId, {
      channel,
      event: eventType,
      status,
      limit: limit || 50,
      offset: offset || 0
    });
    
    return success({
      notifications: result.notifications.map(n => n.toJSON()),
      total: result.total,
      limit: result.limit,
      offset: result.offset
    });
    
  } catch (error) {
    Logger.error(`NotificationHistory: ${error.message}`);
    return internalError(error.message);
  }
};
