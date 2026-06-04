const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function isSupabaseConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);
}

function supabaseHeaders(prefer = 'return=representation') {
  return {
    apikey: SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    'Content-Type': 'application/json',
    Prefer: prefer,
  };
}

async function insertOrderConsent(row) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/order_consents`, {
    method: 'POST',
    headers: supabaseHeaders(),
    body: JSON.stringify(row),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Supabase insert failed: ${response.status} ${text}`);
  }

  const data = await response.json();
  return Array.isArray(data) ? data[0] : data;
}

async function updateOrderConsentByConsentId(consentId, patch) {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/order_consents?consent_id=eq.${encodeURIComponent(consentId)}`,
    {
      method: 'PATCH',
      headers: supabaseHeaders(),
      body: JSON.stringify(patch),
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Supabase update failed: ${response.status} ${text}`);
  }

  const data = await response.json();
  return Array.isArray(data) ? data[0] : data;
}

function generateConsentId() {
  const ts = Date.now();
  const rand = Math.floor(Math.random() * 10000);
  return `TF-CONSENT-${ts}-${rand}`;
}

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return String(forwarded[0]).trim();
  }
  return req.headers['x-real-ip'] || req.socket?.remoteAddress || null;
}

function setCors(res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PATCH');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
}

module.exports = {
  isSupabaseConfigured,
  insertOrderConsent,
  updateOrderConsentByConsentId,
  generateConsentId,
  getClientIp,
  setCors,
};
