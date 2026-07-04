/**
 * Point d'entrée pour /api/notifications
 */

const { handler } = require('./api/notifications/index');

exports.handler = handler;
