const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const {
  isSupabaseConfigured,
  getOrderConsentByConsentId,
  getOrderConsentByStripeSessionId,
} = require('./_lib/supabase');
const { fulfillCheckoutSession } = require('./_lib/fulfill-checkout');
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

  const sessionId = req.query.sessionId || req.query.session_id;

  if (!sessionId) {
    return res.status(400).json({ error: 'Session-ID ist erforderlich' });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'Stripe ist nicht konfiguriert' });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(String(sessionId));
    const paid = session.payment_status === 'paid';

    let orderNumber = null;
    let reisevorschlagId = session.metadata?.reisevorschlag_id || null;
    let productName = null;

    if (paid && isSupabaseConfigured()) {
      try {
        const fulfillment = await fulfillCheckoutSession(session.id);
        if (fulfillment.voucherNumber) {
          orderNumber = fulfillment.voucherNumber;
        }
        if (fulfillment.reisevorschlagId) {
          reisevorschlagId = fulfillment.reisevorschlagId;
        }
      } catch (fulfillError) {
        console.error('fulfill-checkout from verify-session:', fulfillError.message);
      }
    }

    if (isSupabaseConfigured()) {
      let order = await getOrderConsentByStripeSessionId(session.id);
      if (!order && session.metadata?.consent_id) {
        order = await getOrderConsentByConsentId(session.metadata.consent_id);
      }
      if (order) {
        orderNumber = order.voucher_number || orderNumber;
        reisevorschlagId = reisevorschlagId || order.reisevorschlag_id || null;
        productName = order.product_name || null;
      }
    }

    res.json({
      paid,
      paymentStatus: session.payment_status,
      orderNumber,
      reisevorschlagId,
      productName,
      processing: paid && !orderNumber,
    });
  } catch (error) {
    console.error('verify-session error:', error.message);
    if (error.type === 'StripeInvalidRequestError') {
      return res.status(404).json({ error: 'Zahlungssitzung nicht gefunden' });
    }
    res.status(500).json({ error: 'Fehler bei der Überprüfung der Zahlung' });
  }
};
