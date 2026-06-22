const PRODUCTION_ORIGINS = new Set([
  'https://travelfaden.com',
  'https://www.travelfaden.com',
]);

const LOCAL_ORIGINS = new Set([
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
]);

const DEFAULT_ALLOW_HEADERS =
  'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version';

function normalizeOrigin(value) {
  if (!value || typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  try {
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const url = new URL(withProtocol);
    return `${url.protocol}//${url.host}`;
  } catch {
    return null;
  }
}

function getAllowedOrigins() {
  const origins = new Set([...PRODUCTION_ORIGINS, ...LOCAL_ORIGINS]);

  const vercelUrl = (process.env.VERCEL_URL || '').trim();
  if (vercelUrl) {
    origins.add(normalizeOrigin(vercelUrl));
  }

  const siteUrl = (process.env.SITE_URL || '').trim().replace(/\/+$/, '');
  if (siteUrl) {
    origins.add(normalizeOrigin(siteUrl));
  }

  origins.delete(null);
  return origins;
}

function isAllowedOrigin(origin) {
  const normalized = normalizeOrigin(origin);
  if (!normalized) return false;
  return getAllowedOrigins().has(normalized);
}

function applyCors(req, res, { methods = 'GET,OPTIONS,POST' } = {}) {
  const origin = normalizeOrigin(req.headers.origin);

  if (origin && isAllowedOrigin(origin)) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }

  res.setHeader('Access-Control-Allow-Methods', methods);
  res.setHeader('Access-Control-Allow-Headers', DEFAULT_ALLOW_HEADERS);
}

function handlePreflight(req, res, options) {
  applyCors(req, res, options);
  const origin = normalizeOrigin(req.headers.origin);
  if (origin && !isAllowedOrigin(origin)) {
    res.status(403).json({ error: 'Origin not allowed' });
    return false;
  }
  res.status(204).end();
  return true;
}

function enforceCors(req, res) {
  const origin = normalizeOrigin(req.headers.origin);
  if (origin && !isAllowedOrigin(origin)) {
    res.status(403).json({ error: 'Origin not allowed' });
    return false;
  }
  return true;
}

/** Trusted site URL for Stripe redirects (success/cancel). */
function resolveRequestOrigin(req) {
  const headerOrigin = normalizeOrigin(req.headers.origin);
  if (headerOrigin && isAllowedOrigin(headerOrigin)) {
    return headerOrigin;
  }

  const referer = req.headers.referer;
  if (referer) {
    try {
      const fromReferer = normalizeOrigin(new URL(referer).origin);
      if (fromReferer && isAllowedOrigin(fromReferer)) {
        return fromReferer;
      }
    } catch {
      // ignore invalid referer
    }
  }

  const host = req.headers['x-forwarded-host'] || req.headers.host;
  if (host) {
    const proto = String(req.headers['x-forwarded-proto'] || 'https').split(',')[0].trim();
    const fromHost = normalizeOrigin(`${proto}://${host}`);
    if (fromHost && isAllowedOrigin(fromHost)) {
      return fromHost;
    }
  }

  return 'https://travelfaden.com';
}

module.exports = {
  applyCors,
  handlePreflight,
  enforceCors,
  resolveRequestOrigin,
  isAllowedOrigin,
};
