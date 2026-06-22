const { isSupabaseConfigured, testSupabaseConnection } = require('./_lib/supabase');
const { applyCors, handlePreflight, enforceCors } = require('./_lib/cors');

module.exports = async (req, res) => {
  applyCors(req, res, { methods: 'GET,OPTIONS' });

  if (req.method === 'OPTIONS') {
    handlePreflight(req, res, { methods: 'GET,OPTIONS' });
    return;
  }

  if (!enforceCors(req, res)) {
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const stripe = Boolean(process.env.STRIPE_SECRET_KEY);
  const supabaseConfigured = isSupabaseConfigured();
  const supabase = supabaseConfigured ? await testSupabaseConnection() : { ok: false, error: 'not_configured' };

  res.json({
    stripe,
    supabase: {
      configured: supabaseConfigured,
      reachable: supabase.ok,
      error: supabase.ok ? null : supabase.error,
      detail: supabase.detail || null,
    },
    checkoutReady: stripe,
    consentStorageReady: supabaseConfigured && supabase.ok,
  });
};
