/**
 * PATCH /api/members/:id - Mettre à jour un membre
 */

const MemberService = require('../../../services/MemberService');
const { success, notFound, badRequest, internalError, options } = require('../../../utils/Response');
const Logger = require('../../../utils/Logger');

exports.handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') return options();
  
  try {
    const id = event.path.split('/')[3];
    const data = JSON.parse(event.body);
    const ip = event.headers['x-forwarded-for'] || 'system';
    
    if (!id || !id.startsWith('ant_')) {
      return badRequest('ID invalide');
    }
    
    const member = await MemberService.updateMember(id, data, ip);
    
    return success({
      success: true,
      member: member.toJSON()
    });
    
  } catch (error) {
    Logger.error(`UpdateMember: ${error.message}`);
    
    if (error.message === 'Membre non trouvé') {
      return notFound(error.message);
    }
    
    return badRequest(error.message);
  }
};
