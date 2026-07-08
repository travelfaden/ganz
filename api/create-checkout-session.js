// Vercel Serverless Function - Tworzenie Stripe Checkout Session
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { validateCheckoutPrice } = require('./_lib/pricing');

const { applyCors, handlePreflight, enforceCors, resolveRequestOrigin } = require('./_lib/cors');

module.exports = async (req, res) => {
  applyCors(req, res, { methods: 'POST,OPTIONS' });

  if (req.method === 'OPTIONS') {
    handlePreflight(req, res, { methods: 'POST,OPTIONS' });
    return;
  }

  if (!enforceCors(req, res)) {
    return;
  }

  // Tylko POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, currency = 'eur', productName, consentId, reisevorschlagId } = req.body;

    if (!amount) {
      console.error('Błąd: Brak kwoty');
      return res.status(400).json({ error: 'Betrag ist erforderlich' });
    }

    const priceCheck = validateCheckoutPrice(amount, productName, reisevorschlagId);
    if (!priceCheck.ok) {
      return res.status(400).json({ error: priceCheck.error });
    }
    const validatedAmount = priceCheck.amount;

    if (currency !== 'eur') {
      return res.status(400).json({ error: 'Nur EUR wird unterstützt' });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('Błąd: Brak klucza Stripe w zmiennych środowiskowych');
      return res.status(500).json({ error: 'Stripe ist nicht konfiguriert' });
    }

    const origin = resolveRequestOrigin(req);

    const checkoutDisplayName = (process.env.CHECKOUT_DISPLAY_NAME || 'Travel Faden').trim();

    // Tworzenie sesji Checkout
    const session = await stripe.checkout.sessions.create({
      locale: 'de',
      branding_settings: {
        display_name: checkoutDisplayName,
      },
      payment_method_types: ['card', 'paypal'],
      wallet_options: {
        link: {
          display: 'never',
        },
      },
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: productName || `Reisevorschlag des Tages - ${validatedAmount}€`,
              description: reisevorschlagId
                ? `Reisevorschlag des Tages ID: ${reisevorschlagId}`
                : `Reisevorschlag des Tages – ${validatedAmount}€`,
            },
            unit_amount: validatedAmount * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
      metadata: {
        voucher_amount: validatedAmount.toString(),
        voucher_currency: currency,
        ...(consentId ? { consent_id: String(consentId) } : {}),
        ...(reisevorschlagId ? { reisevorschlag_id: String(reisevorschlagId) } : {}),
      },
      custom_text: {
        submit: {
          message: 'Vielen Dank, dass Sie Travel Faden gewählt haben!',
        },
      },
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('=== BŁĄD STRIPE ===');
    console.error('Typ błędu:', error.type || 'Unknown');
    console.error('Kod błędu:', error.code || 'Unknown');
    console.error('Wiadomość:', error.message);
    console.error('Pełny błąd:', JSON.stringify(error, null, 2));
    console.error('==================');
    res.status(500).json({ 
      error: 'Fehler beim Erstellen der Zahlungssitzung',
      message: error.message,
      code: error.code,
      type: error.type
    });
  }
};
