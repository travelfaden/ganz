// Vercel Serverless Function - Tworzenie Stripe Checkout Session
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Tylko POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Otrzymano żądanie:', req.body);
    const { amount, currency = 'eur', productName } = req.body;

    if (!amount) {
      console.error('Błąd: Brak kwoty');
      return res.status(400).json({ error: 'Kwota jest wymagana' });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('Błąd: Brak klucza Stripe w zmiennych środowiskowych');
      return res.status(500).json({ error: 'Brak konfiguracji Stripe' });
    }

    console.log('Tworzenie sesji Stripe dla kwoty:', amount);
    
    // Pobierz origin z nagłówka lub użyj domyślnego
    const origin = req.headers.origin || req.headers.host 
      ? `https://${req.headers.host}` 
      : 'http://localhost:3000';

    // Tworzenie sesji Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'paypal'],
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: productName || `Voucher Travel Faden - ${amount}€`,
              description: `Voucher podróżniczy o wartości ${amount}€ do wykorzystania na dowolną ofertę`,
            },
            unit_amount: amount * 100, // Stripe używa centów
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel.html`,
      metadata: {
        voucher_amount: amount.toString(),
        voucher_currency: currency,
      },
      custom_text: {
        submit: {
          message: 'Dziękujemy za wybór Travel Faden!',
        },
      },
    });

    console.log('Sesja utworzona:', session.id);
    res.json({ id: session.id });
  } catch (error) {
    console.error('=== BŁĄD STRIPE ===');
    console.error('Typ błędu:', error.type || 'Unknown');
    console.error('Kod błędu:', error.code || 'Unknown');
    console.error('Wiadomość:', error.message);
    console.error('Pełny błąd:', JSON.stringify(error, null, 2));
    console.error('==================');
    res.status(500).json({ 
      error: 'Błąd podczas tworzenia sesji płatności',
      message: error.message,
      code: error.code,
      type: error.type
    });
  }
};
