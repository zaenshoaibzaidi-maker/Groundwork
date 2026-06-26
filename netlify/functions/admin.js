const { getStore } = require('@netlify/blobs');

const ALLOWED_ORIGIN = 'https://groundworkus.live';
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60 * 1000;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const requestLog = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT;
}

function getCodesStore() {
  return getStore({
    name: 'access-codes',
    siteID: process.env.NETLIFY_SITE_ID,
    token: process.env.NETLIFY_TOKEN,
  });
}

async function readCodes(store) {
  return (await store.get('codes', { type: 'json' })) || [];
}

async function writeCodes(store, codes) {
  await store.setJSON('codes', codes);
}

exports.handler = async (event) => {
  console.log('ENV CHECK', { siteID: process.env.NETLIFY_SITE_ID, hasToken: !!process.env.NETLIFY_TOKEN });

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

  const ip =
    event.headers['x-forwarded-for']?.split(',')[0].trim() ||
    event.headers['client-ip'] ||
    'unknown';

  if (isRateLimited(ip)) {
    return {
      statusCode: 429,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Too many requests' }),
    };
  }

  const authHeader = event.headers.authorization || event.headers.Authorization;
  if (!authHeader || authHeader !== process.env.ADMIN_PASSWORD) {
    return {
      statusCode: 401,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Unauthorized' }),
    };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (err) {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Invalid JSON body' }),
    };
  }

  const { action } = payload;
  const store = getCodesStore();

  if (action === 'list') {
    const codes = await readCodes(store);
    return {
      statusCode: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ codes }),
    };
  }

  if (action === 'add') {
    const { code, label } = payload;
    if (typeof code !== 'string' || !code.trim()) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'Missing code' }),
      };
    }

    const codes = await readCodes(store);
    codes.push({
      code,
      label: typeof label === 'string' ? label : '',
      active: true,
      createdAt: new Date().toISOString(),
    });
    await writeCodes(store, codes);

    return {
      statusCode: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true }),
    };
  }

  if (action === 'deactivate') {
    const { code } = payload;
    if (typeof code !== 'string' || !code.trim()) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'Missing code' }),
      };
    }

    const codes = await readCodes(store);
    const entry = codes.find((c) => c.code.toLowerCase() === code.toLowerCase());
    if (!entry) {
      return {
        statusCode: 404,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'Code not found' }),
      };
    }
    entry.active = false;
    await writeCodes(store, codes);

    return {
      statusCode: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true }),
    };
  }

  return {
    statusCode: 400,
    headers: CORS_HEADERS,
    body: JSON.stringify({ error: 'Unknown action' }),
  };
};
