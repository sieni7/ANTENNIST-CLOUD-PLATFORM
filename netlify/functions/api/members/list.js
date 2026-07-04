/**
 * GET /api/members - Lister les membres
 */

const MemberService = require('../../../services/MemberService');
const { success, internalError, options } = require('../../../utils/Response');
const Logger = require('../../../utils/Logger');

exports.handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') return options();
  
  try {
    const { region, specialty, status, certified, visible, search, limit, offset } = 
      event.queryStringParameters || {};
    
    const result = await MemberService.listMembers({
      region,
      specialty,
      status,
      certified: certified === 'true' ? true : certified === 'false' ? false : undefined,
      visible: visible === 'true' ? true : visible === 'false' ? false : undefined,
      search,
      limit: limit || 100,
      offset: offset || 0
    });
    
    return success({
      members: result.members.map(m => m.toJSON()),
      total: result.total,
      limit: result.limit,
      offset: result.offset
    });
    
  } catch (error) {
    Logger.error(`ListMembers: ${error.message}`);
    return internalError(error.message);
  }
};
