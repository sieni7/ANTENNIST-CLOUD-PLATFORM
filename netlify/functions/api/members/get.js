/**
 * GET /api/members/:id - Obtenir un membre
 */

const MemberService = require('../../../services/MemberService');
const { success, notFound, badRequest, internalError, options } = require('../../../utils/Response');
const Logger = require('../../../utils/Logger');

exports.handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') return options();
  
  try {
    const id = event.path.split('/')[3];
    
    if (!id || !id.startsWith('ant_')) {
      return badRequest('ID invalide');
    }
    
    const member = await MemberService.getMember(id);
    
    return success({ member: member.toJSON() });
    
  } catch (error) {
    Logger.error(`GetMember: ${error.message}`);
    
    if (error.message === 'Membre non trouvé') {
      return notFound(error.message);
    }
    
    return internalError(error.message);
  }
};
