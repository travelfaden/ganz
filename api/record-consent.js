const {
  isSupabaseConfigured,
  insertOrderConsent,
  generateConsentId,
  getClientIp,
} = require('./_lib/supabase');
const { applyCors, handlePreflight, enforceCors } = require('./_lib/cors');
const {
  normalizeReisevorschlagId,
  isValidReisevorschlagId,
} = require('./_lib/reisevorschlag-ids');
const { sanitizeFormData } = require('./_lib/form-pdf');
const { validateCheckoutPrice, validateFormTravelersAgainstBooking } = require('./_lib/pricing');

module.exports = async (req, res) => {
  applyCors(req, res, { methods: 'POST,OPTIONS' });

  if (req.method === 'OPTIONS') {
    handlePreflight(req, res, { methods: 'POST,OPTIONS' });
    return;
  }

  if (!enforceCors(req, res)) {
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

    const normalizedRid = reisevorschlagId ? normalizeReisevorschlagId(reisevorschlagId) : null;
    const priceCheck = validateCheckoutPrice(amount, productName, normalizedRid);
    if (!priceCheck.ok) {
      return res.status(400).json({ error: priceCheck.error });
    }

    const consentId = generateConsentId();

    const row = {
      consent_id: consentId,
      ip_address: getClientIp(req),
      user_agent: req.headers['user-agent'] || null,
      amount: priceCheck.amount,
      currency,
      product_name: productName || null,
      consents,
      payment_status: 'pending',
    };
    const isRdT = /Reisevorschlag des Tages/i.test(productName || '') || Boolean(normalizedRid);

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
      const travelerCheck = validateFormTravelersAgainstBooking(cleanedFormData);
      if (!travelerCheck.ok) {
        return res.status(400).json({ error: travelerCheck.error });
      }
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
