// PRZYKŁAD BACKENDU DLA STRIPE - Node.js/Express
// Ten plik pokazuje jak stworzyć endpoint do tworzenia Stripe Checkout Session

/*
INSTRUKCJA:

1. Zainstaluj zależności:
   npm install express stripe cors dotenv resend

2. Utwórz plik .env z kluczami:
   STRIPE_SECRET_KEY=sk_test_... (lub sk_live_... dla produkcji)
   RESEND_API_KEY=re_... (klucz z https://resend.com/api-keys)
   FROM_EMAIL=noreply@twoja-domena.pl (lub użyj domeny Resend)
   CONTACT_EMAIL=twoj-email@example.com (email do kontaktów)

3. Uruchom serwer:
   node backend-example.js

4. Upewnij się, że frontend wskazuje na właściwy URL backendu
*/

require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');
const { Resend } = require('resend');

const app = express();
const PORT = process.env.PORT || 3000;

// Inicjalizacja Resend
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev'; // Domyślny email Resend dla testów
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'contact@example.com';

// Middleware
app.use(cors({
  origin: true, // Pozwól na wszystkie originy (dla testów)
  credentials: true
}));
app.use(express.json());
app.use(express.static('.')); // Serwuj pliki statyczne

// Funkcja pomocnicza do wysyłania emaili
async function sendEmail(to, subject, html, text = null) {
  if (!resend) {
    console.warn('⚠️  Resend nie jest skonfigurowany. Dodaj RESEND_API_KEY do .env');
    return { success: false, error: 'Resend nie jest skonfigurowany' };
  }

  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: subject,
      html: html,
      text: text || subject, // Fallback do tekstu jeśli nie podano
    });

    console.log('✅ Email wysłany:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Błąd wysyłania emaila:', error);
    return { success: false, error: error.message };
  }
}

// Funkcja do generowania numeru vouchera
function generateVoucherNumber() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `TF-${timestamp}-${random}`;
}

// Szablon emaila z voucherem
function createVoucherEmailTemplate(voucherNumber, amount, currency, customerEmail, customerName = null) {
  const name = customerName || customerEmail.split('@')[0];
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #2563eb, #0ea5e9); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
    .voucher-box { background: white; border: 2px dashed #2563eb; padding: 20px; margin: 20px 0; text-align: center; border-radius: 8px; }
    .voucher-number { font-size: 24px; font-weight: bold; color: #2563eb; margin: 10px 0; }
    .voucher-amount { font-size: 32px; font-weight: bold; color: #0ea5e9; margin: 10px 0; }
    .button { display: inline-block; background: linear-gradient(135deg, #2563eb, #0ea5e9); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Dziękujemy za zakup!</h1>
      <p>Travel Faden</p>
    </div>
    <div class="content">
      <p>Witaj ${name},</p>
      <p>Twoja płatność została pomyślnie zrealizowana. Oto Twój voucher podróżniczy:</p>
      
      <div class="voucher-box">
        <div style="font-size: 14px; color: #666; margin-bottom: 10px;">NUMER VOUCHERA</div>
        <div class="voucher-number">${voucherNumber}</div>
        <div style="font-size: 14px; color: #666; margin-top: 20px;">WARTOŚĆ</div>
        <div class="voucher-amount">${amount} ${currency.toUpperCase()}</div>
      </div>
      
      <p>Ten voucher możesz wykorzystać na dowolną ofertę Travel Faden w ciągu 180 dni od daty zakupu.</p>
      
      <p style="text-align: center;">
        <a href="https://twoja-domena.pl" class="button">Zobacz Oferty</a>
      </p>
      
      <p><strong>Co dalej?</strong></p>
      <ul>
        <li>Wybierz jedną z naszych usług (Propozycja Dnia, City Break, Loty, Noclegi)</li>
        <li>Skontaktuj się z nami, podając numer vouchera</li>
        <li>Otrzymasz spersonalizowaną ofertę podróży</li>
      </ul>
      
      <p>Jeśli masz pytania, skontaktuj się z nami pod adresem: ${CONTACT_EMAIL}</p>
      
      <div class="footer">
        <p>Travel Faden - Idealne wakacje dla Ciebie</p>
        <p>Ten email został wysłany automatycznie. Prosimy nie odpowiadać na tę wiadomość.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

// Endpoint do tworzenia Checkout Session
app.post('/api/create-checkout-session', async (req, res) => {
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
    // Tworzenie sesji Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'paypal'], // Karty, PayPal (Apple Pay i Google Pay są automatycznie dostępne przez 'card')
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: productName || `Voucher Travel Faden - ${amount}€`,
              description: `Voucher podróżniczy o wartości ${amount}€ do wykorzystania na dowolną ofertę`,
            },
            unit_amount: amount * 100, // Stripe używa centów, więc mnożymy przez 100
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.origin || req.headers.host ? `http://${req.headers.host}` : 'http://localhost:3000'}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin || req.headers.host ? `http://${req.headers.host}` : 'http://localhost:3000'}/cancel.html`,
      metadata: {
        voucher_amount: amount.toString(),
        voucher_currency: currency,
      },
      // UWAGA: Stripe Link jest automatycznie dostępny przez 'card'
      // Aby go wyłączyć, przejdź do Stripe Dashboard → Settings → Payment methods → Stripe Link → Disable
      // Customizacja designu Checkout
      custom_text: {
        submit: {
          message: 'Dziękujemy za wybór Travel Faden!',
        },
      },
      // Możesz dodać logo (URL do obrazka)
      // logo_url: 'https://twoja-domena.pl/logo.png',
      // Kolory (można też ustawić w Stripe Dashboard → Settings → Branding)
      // payment_intent_data: {
      //   description: `Płatność za usługę Travel Faden - ${productName}`,
      // },
      // Opcjonalnie: możesz dodać webhook do weryfikacji płatności
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
});

// Endpoint do weryfikacji sesji (opcjonalnie)
app.get('/api/verify-session/:sessionId', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Webhook endpoint do obsługi zdarzeń Stripe (opcjonalnie, ale zalecane)
app.post('/api/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Obsługa różnych typów zdarzeń
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('✅ Płatność zakończona:', session.id);
      
      // Pobierz szczegóły sesji z informacjami o kliencie
      const sessionDetails = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ['customer', 'customer_details']
      });
      
      // Generuj numer vouchera
      const voucherNumber = generateVoucherNumber();
      const amount = sessionDetails.metadata?.voucher_amount || sessionDetails.amount_total / 100;
      const currency = sessionDetails.metadata?.voucher_currency || sessionDetails.currency || 'eur';
      const customerEmail = sessionDetails.customer_details?.email || sessionDetails.customer_email;
      const customerName = sessionDetails.customer_details?.name || null;
      
      console.log('📧 Wysyłanie emaila z voucherem do:', customerEmail);
      
      // Wysyłanie emaila z voucherem
      if (customerEmail) {
        const emailSubject = `Twój voucher Travel Faden - ${voucherNumber}`;
        const emailHtml = createVoucherEmailTemplate(
          voucherNumber,
          amount,
          currency,
          customerEmail,
          customerName
        );
        
        const emailResult = await sendEmail(customerEmail, emailSubject, emailHtml);
        
        if (emailResult.success) {
          console.log('✅ Email z voucherem wysłany pomyślnie');
        } else {
          console.error('❌ Błąd wysyłania emaila:', emailResult.error);
        }
      } else {
        console.warn('⚠️  Brak adresu email klienta - nie można wysłać vouchera');
      }
      
      // TODO: Tutaj możesz zapisać informacje o voucherach do bazy danych
      // Przykład:
      // await saveVoucherToDatabase({
      //   voucherNumber,
      //   amount,
      //   currency,
      //   customerEmail,
      //   sessionId: session.id,
      //   createdAt: new Date()
      // });
      
      break;
    default:
      console.log(`ℹ️  Nieobsługiwane zdarzenie: ${event.type}`);
  }

  res.json({received: true});
});

// Endpoint do wysyłania testowego emaila (opcjonalnie, do testów)
app.post('/api/send-test-email', async (req, res) => {
  try {
    const { to, subject, message } = req.body;
    
    if (!to) {
      return res.status(400).json({ error: 'Adres email jest wymagany' });
    }
    
    const emailHtml = `
      <h1>Test Email z Travel Faden</h1>
      <p>${message || 'To jest testowy email z Resend!'}</p>
      <p>Jeśli otrzymałeś ten email, oznacza to, że integracja z Resend działa poprawnie! ✅</p>
    `;
    
    const result = await sendEmail(to, subject || 'Test Email - Travel Faden', emailHtml);
    
    if (result.success) {
      res.json({ success: true, message: 'Email wysłany pomyślnie', data: result.data });
    } else {
      res.status(500).json({ error: 'Błąd wysyłania emaila', details: result.error });
    }
  } catch (error) {
    console.error('Błąd:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint do wysyłania emaila kontaktowego (z formularza kontaktowego)
app.post('/api/send-contact-email', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Wszystkie pola są wymagane' });
    }
    
    // Email do Ciebie (jako właściciela strony)
    const adminEmailHtml = `
      <h2>Nowa wiadomość z formularza kontaktowego</h2>
      <p><strong>Od:</strong> ${name} (${email})</p>
      <p><strong>Wiadomość:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
      <hr>
      <p style="color: #666; font-size: 12px;">Odpowiedz na ten email, aby skontaktować się z klientem.</p>
    `;
    
    // Email potwierdzający do klienta
    const customerEmailHtml = `
      <h2>Dziękujemy za wiadomość!</h2>
      <p>Witaj ${name},</p>
      <p>Otrzymaliśmy Twoją wiadomość i skontaktujemy się z Tobą wkrótce.</p>
      <p><strong>Twoja wiadomość:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
      <hr>
      <p>Pozdrawiamy,<br>Zespół Travel Faden</p>
    `;
    
    // Wysyłanie emaila do Ciebie
    const adminResult = await sendEmail(
      CONTACT_EMAIL,
      `Nowa wiadomość od ${name} - Travel Faden`,
      adminEmailHtml
    );
    
    // Wysyłanie potwierdzenia do klienta
    const customerResult = await sendEmail(
      email,
      'Dziękujemy za wiadomość - Travel Faden',
      customerEmailHtml
    );
    
    if (adminResult.success && customerResult.success) {
      res.json({ success: true, message: 'Wiadomość wysłana pomyślnie' });
    } else {
      res.status(500).json({ 
        error: 'Błąd wysyłania wiadomości',
        adminError: adminResult.error,
        customerError: customerResult.error
      });
    }
  } catch (error) {
    console.error('Błąd:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Serwer działa na porcie ${PORT}`);
  console.log(`💳 Stripe endpoint: http://localhost:${PORT}/api/create-checkout-session`);
  console.log(`📧 Email testowy: http://localhost:${PORT}/api/send-test-email`);
  console.log(`📬 Kontakt email: http://localhost:${PORT}/api/send-contact-email`);
  if (!resend) {
    console.warn('⚠️  Resend nie jest skonfigurowany. Dodaj RESEND_API_KEY do pliku .env');
  } else {
    console.log('✅ Resend jest skonfigurowany');
  }
});

/*
ALTERNATYWNE ROZWIĄZANIA:

1. PHP:
   Użyj Stripe PHP SDK i stwórz podobny endpoint

2. Python (Flask):
   from flask import Flask, request, jsonify
   import stripe
   
   stripe.api_key = "YOUR_SECRET_KEY"
   app = Flask(__name__)
   
   @app.route('/api/create-checkout-session', methods=['POST'])
   def create_session():
       # Podobna logika jak w Node.js
       pass

3. Serverless (AWS Lambda, Vercel, Netlify Functions):
   Możesz użyć funkcji serverless zamiast pełnego serwera
*/

