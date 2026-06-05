const { Resend } = require('resend');
const { generateFormPdfBuffer } = require('./form-pdf');

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev';
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'travelfaden@gmail.com';

async function sendAdminFormPdfEmail({
  productName,
  voucherNumber,
  customerEmail,
  amount,
  currency,
  formData,
}) {
  if (!resend) {
    return { success: false, error: 'Resend nicht konfiguriert' };
  }

  try {
    const pdfBuffer = await generateFormPdfBuffer({
      productName,
      voucherNumber,
      customerEmail,
      amount,
      currency,
      formData,
    });

    const safeOrder = String(voucherNumber || 'unbekannt').replace(/[^\w-]/g, '');
    const filename = `Formular-${safeOrder}.pdf`;

    const html = `
      <h2>Neue bezahlte Bestellung</h2>
      <p><strong>Dienstleistung:</strong> ${productName || '—'}</p>
      <p><strong>Bestellnummer:</strong> ${voucherNumber || '—'}</p>
      <p><strong>Kunde:</strong> ${customerEmail || '—'}</p>
      <p><strong>Betrag:</strong> ${amount || '—'} ${(currency || 'eur').toUpperCase()}</p>
      <p>Im Anhang finden Sie das ausgefüllte Kundenformular als PDF.</p>
    `;

    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: [CONTACT_EMAIL],
      reply_to: customerEmail || CONTACT_EMAIL,
      subject: `Neue Bestellung ${voucherNumber} – ${productName || 'Travel Faden'}`,
      html,
      text: `Neue Bestellung ${voucherNumber} – ${productName}. Formular im PDF-Anhang.`,
      attachments: [
        {
          filename,
          content: pdfBuffer,
        },
      ],
    });

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

module.exports = {
  sendAdminFormPdfEmail,
};
