/**
 * Point d'entrée pour /api/members
 * Redirige vers le routeur
 */

const { handler } = require('./api/members/index');

exports.handler = handler;
