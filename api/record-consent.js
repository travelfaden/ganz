const {
  isSupabaseConfigured,
  insertOrderConsent,
  generateConsentId,
  getClientIp,
  setCors,
} = require('./_lib/supabase');
const {
  normalizeReisevorschlagId,
  isValidReisevorschlagId,
} = require('./_lib/reisevorschlag-ids');
const { sanitizeFormData } = require('./_lib/form-pdf');

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
    return res.status(500).json({ error: 'Supabase ist nicht konfiguriert' });
  }

  try {
    const { amount, currency = 'eur', productName, consents, reisevorschlagId, formData } = req.body || {};

    if (!amount || !Array.isArray(consents) || consents.length === 0) {
      return res.status(400).json({ error: 'Betrag und Einwilligungen sind erforderlich' });
    }

    const allChecked = consents.every((c) => c.checked === true);
    if (!allChecked) {
      return res.status(400).json({ error: 'Alle erforderlichen Einwilligungen müssen bestätigt werden' });
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
    const isRdT = /Reisevorschlag des Tages/i.test(productName || '');
    const normalizedRid = reisevorschlagId ? normalizeReisevorschlagId(reisevorschlagId) : null;

    if (isRdT) {
      if (!normalizedRid || !isValidReisevorschlagId(normalizedRid)) {
        return res.status(400).json({
          error: 'Ungültige oder fehlende Reisevorschlag des Tages ID',
        });
      }
      row.reisevorschlag_id = normalizedRid;
    } else if (normalizedRid) {
      if (!isValidReisevorschlagId(normalizedRid)) {
        return res.status(400).json({
          error: 'Ungültige Reisevorschlag des Tages ID',
        });
      }
      row.reisevorschlag_id = normalizedRid;
    }

    const cleanedFormData = sanitizeFormData(formData);
    if (cleanedFormData && !isRdT) {
      row.form_data = cleanedFormData;
    }

    await insertOrderConsent(row);

    console.log('Zapisano zgodę:', consentId);
    res.json({ consentId });
  } catch (error) {
    console.error('record-consent error:', error);
    res.status(500).json({
      error: 'Fehler beim Speichern der Einwilligung',
      message: error.message,
    });
  }
};
