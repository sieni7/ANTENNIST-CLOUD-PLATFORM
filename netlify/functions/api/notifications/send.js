/**
 * POST /api/notifications/send - Envoyer une notification
 */

const NotificationService = require('../../../services/NotificationService');
const MemberRepository = require('../../../repositories/MemberRepository');
const { success, badRequest, notFound, internalError, options } = require('../../../utils/Response');
const Logger = require('../../../utils/Logger');

exports.handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') return options();
  
  try {
    const { member_id, event_type, data } = JSON.parse(event.body);
    
    if (!member_id) {
      return badRequest('ID du membre requis');
    }
    
    if (!event_type) {
      return badRequest('Type d\'événement requis');
    }
    
    const member = await MemberRepository.findById(member_id);
    if (!member) {
      return notFound('Membre non trouvé');
    }
    
    const notification = await NotificationService.send(
      member,
      event_type,
      data || {}
    );
    
    return success({
      success: true,
      notification: notification.toJSON()
    });
    
  } catch (error) {
    Logger.error(`NotificationSend: ${error.message}`);
    return badRequest(error.message);
  }
};
