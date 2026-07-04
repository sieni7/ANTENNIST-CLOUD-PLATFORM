/**
 * DELETE /api/members/:id - Supprimer un membre (soft delete)
 */

const MemberService = require('../../../services/MemberService');
const { success, notFound, badRequest, internalError, options } = require('../../../utils/Response');
const Logger = require('../../../utils/Logger');

exports.handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') return options();
  
  try {
    const id = event.path.split('/')[3];
    const ip = event.headers['x-forwarded-for'] || 'system';
    
    if (!id || !id.startsWith('ant_')) {
      return badRequest('ID invalide');
    }
    
    await MemberService.deleteMember(id, ip);
    
    return success({
      success: true,
      message: 'Membre désactivé'
    });
    
  } catch (error) {
    Logger.error(`DeleteMember: ${error.message}`);
    
    if (error.message === 'Membre non trouvé') {
      return notFound(error.message);
    }
    
    return internalError(error.message);
  }
};
