/**
 * Router pour /api/members
 * Redirige vers les handlers appropriés
 */

const createHandler = require('./create');
const updateHandler = require('./update');
const deleteHandler = require('./delete');
const listHandler = require('./list');
const getHandler = require('./get');
const { notFound, options } = require('../../../utils/Response');

exports.handler = async (event, context) => {
  const { httpMethod, path } = event;
  
  // CORS
  if (httpMethod === 'OPTIONS') return options();
  
  // Extraire l'ID si présent
  const parts = path.split('/');
  const hasId = parts.length > 3 && parts[3].startsWith('ant_');
  
  // Routing
  switch (httpMethod) {
    case 'GET':
      if (hasId) {
        return getHandler.handler(event, context);
      }
      return listHandler.handler(event, context);
      
    case 'POST':
      return createHandler.handler(event, context);
      
    case 'PATCH':
      if (hasId) {
        return updateHandler.handler(event, context);
      }
      return notFound('ID requis');
      
    case 'DELETE':
      if (hasId) {
        return deleteHandler.handler(event, context);
      }
      return notFound('ID requis');
      
    default:
      return notFound('Méthode non supportée');
  }
};
