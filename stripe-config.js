// Konfiguracja Stripe dla Travel Faden
// Ten plik zawiera instrukcje konfiguracji

/*
INSTRUKCJA KONFIGURACJI STRIPE:

1. Zaloguj się do Stripe Dashboard: https://dashboard.stripe.com/

2. Przejdź do Developers > API keys

3. Skopiuj "Publishable key" (klucz publiczny)

4. W pliku script.js znajdź linię:
   const stripe = Stripe('YOUR_PUBLISHABLE_KEY');
   
5. Zastąp 'YOUR_PUBLISHABLE_KEY' swoim kluczem publicznym

6. Dla testów możesz użyć klucza testowego (zaczyna się od pk_test_)

WAŻNE: 
- Klucz publiczny (publishable key) jest bezpieczny do użycia w frontendzie
- NIGDY nie umieszczaj klucza prywatnego (secret key) w kodzie frontendowym!
- Klucz prywatny musi być tylko w backendzie

BACKEND ENDPOINT:

Musisz stworzyć endpoint na swoim backendzie, który będzie tworzyć Stripe Checkout Session.

Przykład dla Node.js/Express:

const stripe = require('stripe')('YOUR_SECRET_KEY');

app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { amount, currency, productName } = req.body;
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency || 'eur',
            product_data: {
              name: productName || `Voucher Travel Faden - ${amount}€`,
            },
            unit_amount: amount * 100, // Stripe używa centów
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.origin}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/cancel.html`,
      metadata: {
        voucher_amount: amount,
      },
    });

    res.json({ id: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

ALTERNATYWA - Bez backendu (tylko dla testów):

Możesz użyć Stripe Payment Intents API bezpośrednio z frontendu,
ale to wymaga więcej kodu i jest mniej bezpieczne dla produkcji.
*/

