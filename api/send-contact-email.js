const { Resend } = require('resend');
const { FROM_EMAIL, CONTACT_EMAIL } = require('./_lib/email-config');

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

function escapeHtml(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function sendEmail(to, subject, html, text, replyTo = null) {
  if (!resend) {
    return { success: false, error: 'Resend ist nicht konfiguriert' };
  }

  try {
    const payload = {
      from: FROM_EMAIL,
      to: [to],
      subject,
      html,
      text: text || subject,
    };
    if (replyTo) {
      payload.reply_to = replyTo;
    }

    const data = await resend.emails.send(payload);
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
    const { name, email, message } = req.body || {};
    const trimmedName = String(name || '').trim();
    const trimmedEmail = String(email || '').trim();
    const trimmedMessage = String(message || '').trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      return res.status(400).json({ error: 'Alle Felder sind erforderlich' });
    }

    const safeName = escapeHtml(trimmedName);
    const safeEmail = escapeHtml(trimmedEmail);
    const safeMessageHtml = escapeHtml(trimmedMessage).replace(/\n/g, '<br>');

    const adminEmailHtml = `
      <h2>Neue Kontaktanfrage</h2>
      <p><strong>Von:</strong> ${safeName} (${safeEmail})</p>
      <p><strong>Nachricht:</strong></p>
      <p>${safeMessageHtml}</p>
      <hr>
      <p style="color:#666;font-size:12px;">Antworten Sie auf diese E-Mail, um den Kunden zu kontaktieren.</p>
    `;

    const customerEmailHtml = `
      <h2>Vielen Dank für Ihre Nachricht</h2>
      <p>Guten Tag ${safeName},</p>
      <p>wir haben Ihre Nachricht erhalten und melden uns in Kürze bei Ihnen.</p>
      <p><strong>Ihre Nachricht:</strong></p>
      <p>${safeMessageHtml}</p>
      <hr>
      <p>Mit freundlichen Grüßen<br>Travel Faden<br>Bartosz Nagiec</p>
    `;

    const adminResult = await sendEmail(
      CONTACT_EMAIL,
      `Neue Kontaktanfrage von ${trimmedName} – Travel Faden`,
      adminEmailHtml,
      `Neue Kontaktanfrage von ${trimmedName} (${trimmedEmail}):\n\n${trimmedMessage}`,
      trimmedEmail
    );

    const customerResult = await sendEmail(
      trimmedEmail,
      'Ihre Nachricht an Travel Faden',
      customerEmailHtml,
      `Guten Tag ${trimmedName},\n\nwir haben Ihre Nachricht erhalten und melden uns in Kürze bei Ihnen.\n\nIhre Nachricht:\n${trimmedMessage}\n\nMit freundlichen Grüßen\nTravel Faden`,
      CONTACT_EMAIL
    );

    if (adminResult.success && customerResult.success) {
      res.json({ success: true, message: 'Nachricht erfolgreich gesendet' });
      return;
    }

    res.status(500).json({
      error: 'Die Nachricht konnte nicht gesendet werden',
      adminError: adminResult.error,
      customerError: customerResult.error,
    });
  } catch (error) {
    console.error('send-contact-email error:', error);
    res.status(500).json({ error: error.message });
  }
};
