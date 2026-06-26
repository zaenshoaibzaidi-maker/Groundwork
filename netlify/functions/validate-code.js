const { getStore } = require('@netlify/blobs');

const ALLOWED_ORIGIN = 'https://groundworkus.live';
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60 * 1000;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const requestLog = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT;
}

function getClientIp(event) {
  const trusted = event.headers['x-nf-client-connection-ip'] || event.headers['client-ip'];
  if (trusted) return trusted;

  const xff = event.headers['x-forwarded-for'];
  if (xff) {
    const parts = xff.split(',').map((s) => s.trim()).filter(Boolean);
    if (parts.length) return parts[parts.length - 1];
  }

  return 'unknown';
}

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

  const ip = getClientIp(event);

  if (isRateLimited(ip)) {
    return {
      statusCode: 429,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Too many requests' }),
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

  const store = getStore({
    name: 'access-codes',
    siteID: process.env.NETLIFY_SITE_ID,
    token: process.env.NETLIFY_TOKEN,
  });
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
