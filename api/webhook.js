// Vercel Serverless Function - Webhook Stripe
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Resend } = require('resend');

// Funkcje pomocnicze (importowane z utils)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev';
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'contact@example.com';

// Funkcja pomocnicza do wysyłania emaili
async function sendEmail(to, subject, html, text = null) {
  if (!resend) {
    console.warn('⚠️  Resend nie jest skonfigurowany. Dodaj RESEND_API_KEY do zmiennych środowiskowych');
    return { success: false, error: 'Resend nie jest skonfigurowany' };
  }

  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: subject,
      html: html,
      text: text || subject,
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

// Vercel wymaga eksportu domyślnego dla webhooków
module.exports = async (req, res) => {
  // Webhook Stripe wymaga raw body
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Vercel przekazuje body jako Buffer dla webhooków
    // Musimy użyć req.body bezpośrednio (Vercel automatycznie parsuje raw body)
    const body = Buffer.isBuffer(req.body) 
      ? req.body.toString('utf8') 
      : (typeof req.body === 'string' ? req.body : JSON.stringify(req.body));
    
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook Error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Obsługa różnych typów zdarzeń
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('✅ Płatność zakończona:', session.id);
      
      try {
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
      } catch (error) {
        console.error('❌ Błąd podczas przetwarzania płatności:', error);
      }
      
      break;
    default:
      console.log(`ℹ️  Nieobsługiwane zdarzenie: ${event.type}`);
  }

  res.json({ received: true });
};
