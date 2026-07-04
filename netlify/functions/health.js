/**
 * API Health Check
 */

const { success, internalError, options } = require('./utils/Response');
const Logger = require('./utils/Logger');
const Config = require('./utils/Config');

exports.handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') return options();
  
  try {
    return success({
      status: 'healthy',
      version: '0.0.1',
      environment: Config.env,
      timestamp: new Date().toISOString(),
      services: {
        api: 'operational',
        data: 'operational',
        audit: 'operational'
      }
    });
  } catch (error) {
    Logger.error(`Health: ${error.message}`);
    return internalError('Service unavailable');
  }
};
