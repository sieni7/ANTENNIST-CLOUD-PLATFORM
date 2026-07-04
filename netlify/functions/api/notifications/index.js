/**
 * Router pour /api/notifications
 */

const sendHandler = require('./send');
const historyHandler = require('./history');
const statsHandler = require('./stats');
const processHandler = require('./process');
const { notFound, options } = require('../../../utils/Response');

exports.handler = async (event, context) => {
  const { httpMethod, path } = event;
  
  if (httpMethod === 'OPTIONS') return options();
  
  // POST /api/notifications/send
  if (httpMethod === 'POST' && path.includes('/send')) {
    return sendHandler.handler(event, context);
  }
  
  // POST /api/notifications/process
  if (httpMethod === 'POST' && path.includes('/process')) {
    return processHandler.handler(event, context);
  }
  
  // GET /api/notifications/stats
  if (httpMethod === 'GET' && path.includes('/stats')) {
    return statsHandler.handler(event, context);
  }
  
  // GET /api/notifications/history/:memberId
  if (httpMethod === 'GET' && path.includes('/history')) {
    return historyHandler.handler(event, context);
  }
  
  return notFound('Route non trouvée');
};
