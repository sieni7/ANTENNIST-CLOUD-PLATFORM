/**
 * API Statistiques
 */

const StatsService = require('./services/StatsService');
const { success, internalError, options } = require('./utils/Response');
const Logger = require('./utils/Logger');

exports.handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') return options();
  
  try {
    const stats = await StatsService.getStats();
    return success(stats);
  } catch (error) {
    Logger.error(`Stats: ${error.message}`);
    return internalError(error.message);
  }
};
