/**
 * POST /api/members - Créer un membre
 */

const MemberService = require('../../../services/MemberService');
const { success, badRequest, internalError, options } = require('../../../utils/Response');
const Logger = require('../../../utils/Logger');

exports.handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') return options();
  
  try {
    const data = JSON.parse(event.body);
    
    // Récupérer l'IP
    const ip = event.headers['x-forwarded-for'] || event.headers['client-ip'] || '0.0.0.0';
    data.created_by = ip;
    
    const member = await MemberService.createMember(data);
    
    return success({
      success: true,
      member: member.toJSON(),
      profile_url: `/profil.html?id=${member._id}`
    }, 201);
    
  } catch (error) {
    Logger.error(`CreateMember: ${error.message}`);
    
    if (error.message.includes('Validation') || error.message.includes('requis')) {
      return badRequest(error.message);
    }
    
    return internalError(error.message);
  }
};
