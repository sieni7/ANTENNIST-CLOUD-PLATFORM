/**
 * Response.js - Utilitaires de réponse HTTP standardisés
 * Toutes les réponses API passent par ce module
 *
 * @version 0.0.1
 * @author FITA - TECH_LEAD
 */

const CORS_HEADERS = {
  'Content-Type':                'application/json',
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

/**
 * Réponse de succès
 * @param {object} data - Données à retourner
 * @param {number} statusCode - Code HTTP (défaut: 200)
 */
function success(data, statusCode = 200) {
  return {
    statusCode,
    headers: CORS_HEADERS,
    body: JSON.stringify(data)
  };
}

/**
 * Réponse d'erreur générique
 */
function error(message, statusCode = 400, details = null) {
  const body = { error: message };
  if (details) body.details = details;

  return {
    statusCode,
    headers: { ...CORS_HEADERS },
    body: JSON.stringify(body)
  };
}

/** 404 */
function notFound(message = 'Ressource non trouvée') {
  return error(message, 404);
}

/** 400 */
function badRequest(message = 'Requête invalide', details = null) {
  return error(message, 400, details);
}

/** 500 */
function internalError(message = 'Erreur interne du serveur') {
  return error(message, 500);
}

/** 401 */
function unauthorized(message = 'Non autorisé') {
  return error(message, 401);
}

/** 403 */
function forbidden(message = 'Accès interdit') {
  return error(message, 403);
}

/** 200 OPTIONS (CORS preflight) */
function options() {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin':  '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    },
    body: ''
  };
}

module.exports = {
  success,
  error,
  notFound,
  badRequest,
  internalError,
  unauthorized,
  forbidden,
  options
};
