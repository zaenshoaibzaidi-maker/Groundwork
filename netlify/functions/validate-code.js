const { getStore } = require('@netlify/blobs');

const ALLOWED_ORIGIN = 'https://groundworkus.live';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  let code;
  try {
    code = JSON.parse(event.body || '{}').code;
  } catch (err) {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Invalid JSON body' }),
    };
  }

  if (typeof code !== 'string' || !code.trim()) {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Missing code' }),
    };
  }

  const store = getStore('access-codes');
  const codes = (await store.get('codes', { type: 'json' })) || [];

  const valid = codes.some(
    (entry) => entry.active === true && entry.code.toLowerCase() === code.toLowerCase()
  );

  return {
    statusCode: 200,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    body: JSON.stringify({ valid }),
  };
};
