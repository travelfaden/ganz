// Vercel Serverless Function - Wysyłanie emaila kontaktowego
const { Resend } = require('resend');

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev';
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'contact@example.com';

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
};
