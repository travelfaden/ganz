// Vercel Serverless Function - testowy e-mail (prosty lub potwierdzenie zakupu)
const { Resend } = require('resend');
const {
  generateVoucherNumber,
  createPurchaseConfirmationEmail,
  buildPurchaseConfirmationSubject,
} = require('./_lib/purchase-email');

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev';

async function sendEmail(to, subject, html, text = null) {
  if (!resend) {
    return { success: false, error: 'Resend nie jest skonfigurowany (RESEND_API_KEY)' };
  }

  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject,
      html,
      text: text || subject,
    });
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      to,
      template,
      reisevorschlagId,
      customerName,
      amount = 40,
      currency = 'eur',
    } = req.body || {};

    if (!to) {
      return res.status(400).json({ error: 'Pole "to" (adres e-mail) jest wymagane' });
    }

    let subject;
    let emailHtml;

    if (template === 'purchase-confirmation') {
      const voucherNumber = generateVoucherNumber();
      subject = buildPurchaseConfirmationSubject(voucherNumber, reisevorschlagId || null);
      emailHtml = createPurchaseConfirmationEmail(
        voucherNumber,
        amount,
        currency,
        to,
        customerName || null,
        reisevorschlagId || null
      );
    } else {
      subject = 'Test Email - Travel Faden';
      emailHtml = `
        <h1>Test Email z Travel Faden</h1>
        <p>To jest prosty test Resend.</p>
        <p>Jeśli otrzymałeś ten e-mail, integracja działa ✅</p>
      `;
    }

    const result = await sendEmail(to, subject, emailHtml);

    if (result.success) {
      res.json({ success: true, message: 'E-mail wysłany', subject, data: result.data });
    } else {
      res.status(500).json({ error: 'Błąd wysyłania e-maila', details: result.error });
    }
  } catch (error) {
    console.error('send-test-email:', error);
    res.status(500).json({ error: error.message });
  }
};
