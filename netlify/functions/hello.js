exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      message: 'FITA Antennist API - V0',
      version: '0.0.1',
      status: 'building',
      timestamp: new Date().toISOString()
    })
  };
};
