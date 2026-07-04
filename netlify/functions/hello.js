/**
 * Hello World - Fonction de test Netlify
 * Vérifie que l'infrastructure serverless fonctionne
 *
 * @endpoint GET /api/hello
 * @version 0.0.1
 */

exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      message: '✅ Antennist Cloud Platform V0 - API fonctionnelle',
      version: '0.0.1',
      status: 'ready',
      timestamp: new Date().toISOString(),
      endpoints: {
        members: '/api/members',
        stats:   '/api/stats',
        health:  '/api/health'
      }
    })
  };
};
