const {
  isSupabaseConfigured,
  insertOrderConsent,
  generateConsentId,
  getClientIp,
  setCors,
} = require('./_lib/supabase');

module.exports = async (req, res) => {
  setCors(res);

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isSupabaseConfigured()) {
    console.error('Brak SUPABASE_URL lub SUPABASE_SERVICE_ROLE_KEY');
    return res.status(500).json({ error: 'Brak konfiguracji Supabase' });
  }

  try {
    const { amount, currency = 'eur', productName, consents, reisevorschlagId } = req.body || {};

    if (!amount || !Array.isArray(consents) || consents.length === 0) {
      return res.status(400).json({ error: 'amount i consents są wymagane' });
    }

    const allChecked = consents.every((c) => c.checked === true);
    if (!allChecked) {
      return res.status(400).json({ error: 'Wszystkie wymagane zgody muszą być zaznaczone' });
    }

    const consentId = generateConsentId();

    const row = {
      consent_id: consentId,
      ip_address: getClientIp(req),
      user_agent: req.headers['user-agent'] || null,
      amount: Number(amount),
      currency,
      product_name: productName || null,
      consents,
      payment_status: 'pending',
    };
    if (reisevorschlagId) {
      row.reisevorschlag_id = String(reisevorschlagId).trim();
    }
    await insertOrderConsent(row);

    console.log('Zapisano zgodę:', consentId);
    res.json({ consentId });
  } catch (error) {
    console.error('record-consent error:', error);
    res.status(500).json({
      error: 'Błąd zapisu zgody',
      message: error.message,
    });
  }
};
