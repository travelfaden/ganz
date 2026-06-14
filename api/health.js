const { isSupabaseConfigured, testSupabaseConnection, setCors } = require('./_lib/supabase');

module.exports = async (req, res) => {
  setCors(res);

  if (req.method === 'OPTIONS') {
    res.status(200).end();
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
