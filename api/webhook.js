function readRawBody(req) {
  return new Promise((resolve, reject) => {
    if (typeof req.body === 'string') {
      resolve(req.body);
      return;
    }
    if (Buffer.isBuffer(req.body)) {
      resolve(req.body.toString('utf8'));
      return;
    }
    if (req.body && typeof req.body === 'object') {
      reject(new Error('Raw body required for Stripe signature verification'));
      return;
    }

    const chunks = [];
    req.on('data', (chunk) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    });
    req.on('end', () => {
      if (chunks.length === 0) {
        reject(new Error('Empty request body'));
        return;
      }
      resolve(Buffer.concat(chunks).toString('utf8'));
    });
    req.on('error', reject);
  });
}

// Vercel Serverless Function - Webhook Stripe
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Resend } = require('resend');
const {
  isSupabaseConfigured,
  getOrderConsentByConsentId,
  getNextOrderNumber,
  updateOrderConsentByConsentId,
} = require('./_lib/supabase');
const {
  createPurchaseConfirmationEmail,
  createPurchaseConfirmationPlainText,
  createServicePurchaseConfirmationEmail,
  createServicePurchaseConfirmationPlainText,
  buildPurchaseConfirmationSubject,
  buildServicePurchaseConfirmationSubject,
  isReisevorschlagDesTagesOrder,
} = require('./_lib/purchase-email');
const { sendAdminNewOrderEmail } = require('./_lib/admin-form-email');
const { FROM_EMAIL, CONTACT_EMAIL } = require('./_lib/email-config');

// Funkcje pomocnicze (importowane z utils)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

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
      reply_to: CONTACT_EMAIL,
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

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const sig = req.headers['stripe-signature'];

  if (!sig) {
    console.error('Webhook Error: No signature found');
    return res.status(400).send('Webhook Error: No signature found');
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('Webhook Error: STRIPE_WEBHOOK_SECRET not configured');
    return res.status(500).send('Webhook Error: STRIPE_WEBHOOK_SECRET not configured');
  }

  let rawBody;
  try {
    rawBody = await readRawBody(req);
  } catch (err) {
    console.error('Webhook Error: Cannot read raw body:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (verifyError) {
    console.error('Signature verification failed:', verifyError.message);
    return res.status(400).send(`Webhook Error: ${verifyError.message}`);
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
        
        const amount = sessionDetails.metadata?.voucher_amount || sessionDetails.amount_total / 100;
        const currency = sessionDetails.metadata?.voucher_currency || sessionDetails.currency || 'eur';
        const customerEmail = sessionDetails.customer_details?.email || sessionDetails.customer_email;
        const customerName = sessionDetails.customer_details?.name || null;
        const consentId = sessionDetails.metadata?.consent_id || null;
        let reisevorschlagId = sessionDetails.metadata?.reisevorschlag_id || null;

        let voucherNumber = null;
        let productName = null;
        let storedFormData = null;

        if (consentId && isSupabaseConfigured()) {
          try {
            const existing = await getOrderConsentByConsentId(consentId);
            productName = existing?.product_name || null;
            storedFormData = existing?.form_data || null;
            voucherNumber = existing?.voucher_number || null;
            if (!reisevorschlagId && existing?.reisevorschlag_id) {
              reisevorschlagId = existing.reisevorschlag_id;
            }

            if (!voucherNumber) {
              voucherNumber = await getNextOrderNumber();
            }

            await updateOrderConsentByConsentId(consentId, {
              stripe_session_id: sessionDetails.id,
              customer_email: customerEmail || null,
              payment_status: 'paid',
              voucher_number: voucherNumber,
            });
            console.log(
              '✅ Zaktualizowano zgodę w Supabase:',
              consentId,
              voucherNumber,
              reisevorschlagId || '(Service)'
            );
          } catch (dbError) {
            console.error('❌ Błąd aktualizacji Supabase:', dbError.message);
          }
        }

        const isRdT = isReisevorschlagDesTagesOrder(reisevorschlagId, productName);

        console.log('📧 Wysyłanie e-maila do:', customerEmail, isRdT ? '(RdT)' : '(Service)');
        
        if (customerEmail && voucherNumber) {
          let emailSubject;
          let emailHtml;
          let emailText;

          if (isRdT) {
            emailSubject = buildPurchaseConfirmationSubject(voucherNumber, reisevorschlagId);
            emailHtml = createPurchaseConfirmationEmail(
              voucherNumber,
              amount,
              currency,
              customerEmail,
              customerName,
              reisevorschlagId
            );
            emailText = createPurchaseConfirmationPlainText(
              voucherNumber,
              customerEmail,
              customerName,
              reisevorschlagId
            );
          } else {
            emailSubject = buildServicePurchaseConfirmationSubject(voucherNumber);
            emailHtml = createServicePurchaseConfirmationEmail(
              voucherNumber,
              customerEmail,
              customerName
            );
            emailText = createServicePurchaseConfirmationPlainText(
              voucherNumber,
              customerEmail,
              customerName
            );
          }

          const emailResult = await sendEmail(customerEmail, emailSubject, emailHtml, emailText);
          
          if (emailResult.success) {
            console.log('✅ E-mail an Kunden gesendet');
          } else {
            console.error('❌ Błąd wysyłania emaila:', emailResult.error);
          }
        } else if (!customerEmail) {
          console.warn('⚠️  Brak adresu email klienta - nie można wysłać vouchera');
        } else if (!voucherNumber) {
          console.warn('⚠️  Brak Bestellnummer (Supabase) - nie można wysłać e-maila');
        }

        if (voucherNumber) {
          const adminResult = await sendAdminNewOrderEmail({
            productName,
            voucherNumber,
            customerEmail,
            customerName,
            amount,
            currency,
            reisevorschlagId,
            isRdT,
            formData: storedFormData,
          });
          if (adminResult.success) {
            console.log('✅ Admin-Benachrichtigung gesendet');
          } else {
            console.error('❌ Admin-Benachrichtigung:', adminResult.error);
          }
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

module.exports.config = {
  api: {
    bodyParser: false,
  },
};
