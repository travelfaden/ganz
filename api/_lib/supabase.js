function getSupabaseUrl() {
  const raw = (process.env.SUPABASE_URL || '').trim();
  if (!raw) return '';
  if (!/^https?:\/\//i.test(raw)) {
    return `https://${raw.replace(/^\/+/, '')}`;
  }
  return raw.replace(/\/+$/, '');
}

const SUPABASE_URL = getSupabaseUrl();
const SUPABASE_SERVICE_ROLE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();

function isSupabaseConfigured() {
  return Boolean(
    SUPABASE_URL &&
    SUPABASE_SERVICE_ROLE_KEY &&
    SUPABASE_URL.includes('.supabase.co')
  );
}

async function supabaseFetch(path, options = {}, timeoutMs = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(`${SUPABASE_URL}${path}`, {
      ...options,
      signal: controller.signal,
    });
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Supabase timeout – Projekt prawdopodobnie wstrzymany lub URL jest nieprawidłowy');
    }
    throw new Error(
      error.cause?.message || error.message || 'Supabase-Verbindung fehlgeschlagen'
    );
  } finally {
    clearTimeout(timer);
  }
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
  const response = await supabaseFetch('/rest/v1/order_consents', {
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

function formatOrderNumber(sequenceValue) {
  const n = Number(sequenceValue);
  const digits = Math.max(3, String(n).length);
  return `TF-${String(n).padStart(digits, '0')}`;
}

async function getOrderConsentByConsentId(consentId) {
  const response = await supabaseFetch(
    `/rest/v1/order_consents?consent_id=eq.${encodeURIComponent(consentId)}&select=*&limit=1`,
    {
      method: 'GET',
      headers: supabaseHeaders(),
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Supabase select failed: ${response.status} ${text}`);
  }

  const data = await response.json();
  return Array.isArray(data) && data.length > 0 ? data[0] : null;
}

async function getNextOrderNumber() {
  const response = await supabaseFetch('/rest/v1/rpc/next_order_number', {
    method: 'POST',
    headers: supabaseHeaders(),
    body: '{}',
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Supabase next_order_number failed: ${response.status} ${text}`);
  }

  const sequenceValue = await response.json();
  return formatOrderNumber(sequenceValue);
}

async function getOrderConsentByStripeSessionId(stripeSessionId) {
  const response = await supabaseFetch(
    `/rest/v1/order_consents?stripe_session_id=eq.${encodeURIComponent(stripeSessionId)}&select=*&limit=1`,
    {
      method: 'GET',
      headers: supabaseHeaders(),
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Supabase select failed: ${response.status} ${text}`);
  }

  const data = await response.json();
  return Array.isArray(data) && data.length > 0 ? data[0] : null;
}

async function updateOrderConsentByConsentId(consentId, patch) {
  const response = await supabaseFetch(
    `/rest/v1/order_consents?consent_id=eq.${encodeURIComponent(consentId)}`,
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
  getOrderConsentByConsentId,
  getOrderConsentByStripeSessionId,
  getNextOrderNumber,
  formatOrderNumber,
  updateOrderConsentByConsentId,
  generateConsentId,
  getClientIp,
  setCors,
  getSupabaseUrl,
  async testSupabaseConnection() {
    if (!isSupabaseConfigured()) {
      return { ok: false, error: 'not_configured' };
    }
    try {
      const response = await supabaseFetch('/rest/v1/order_consents?select=consent_id&limit=1', {
        method: 'GET',
        headers: supabaseHeaders(),
      });
      if (!response.ok) {
        const text = await response.text();
        return { ok: false, error: `http_${response.status}`, detail: text.slice(0, 200) };
      }
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  },
};
