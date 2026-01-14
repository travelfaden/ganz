// Vercel Serverless Function - Wysyłanie testowego emaila
const { Resend } = require('resend');

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev';

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

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
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
};
