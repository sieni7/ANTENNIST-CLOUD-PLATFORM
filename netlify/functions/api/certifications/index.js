/**
 * Router pour /api/certifications
 */

const requestHandler = require('./request');
const approveHandler = require('./approve');
const rejectHandler = require('./reject');
const pendingHandler = require('./pending');
const statsHandler = require('./stats');
const eligibilityHandler = require('./eligibility');
const { notFound, options } = require('../../../utils/Response');

exports.handler = async (event, context) => {
  const { httpMethod, path } = event;
  
  if (httpMethod === 'OPTIONS') return options();
  
  const parts = path.split('/');
  const hasId = parts.length > 3 && parts[3].length > 0;
  const action = parts.length > 4 ? parts[4] : null;
  
  // GET /api/certifications/pending
  if (httpMethod === 'GET' && path.includes('/pending')) {
    return pendingHandler.handler(event, context);
  }
  
  // GET /api/certifications/stats
  if (httpMethod === 'GET' && path.includes('/stats')) {
    return statsHandler.handler(event, context);
  }
  
  // GET /api/certifications/eligibility/:id
  if (httpMethod === 'GET' && path.includes('/eligibility')) {
    return eligibilityHandler.handler(event, context);
  }
  
  // POST /api/certifications
  if (httpMethod === 'POST' && !hasId) {
    return requestHandler.handler(event, context);
  }
  
  // POST /api/certifications/:id/approve
  if (httpMethod === 'POST' && hasId && action === 'approve') {
    return approveHandler.handler(event, context);
  }
  
  // POST /api/certifications/:id/reject
  if (httpMethod === 'POST' && hasId && action === 'reject') {
    return rejectHandler.handler(event, context);
  }
  
  return notFound('Route non trouvée');
};
