const { Resend } = require('resend');
const { generateFormPdfBuffer } = require('./form-pdf');

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev';
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'travelfaden@gmail.com';

function escapeHtml(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function hasFormData(formData) {
  return formData && typeof formData === 'object' && Object.keys(formData).length > 0;
}

async function sendAdminNewOrderEmail({
  productName,
  voucherNumber,
  customerEmail,
  customerName = null,
  amount,
  currency,
  reisevorschlagId = null,
  isRdT = false,
  formData = null,
}) {
  if (!resend) {
    return { success: false, error: 'Resend nicht konfiguriert' };
  }

  try {
    const safeProduct = escapeHtml(productName || 'Travel Faden');
    const safeOrder = escapeHtml(voucherNumber || '—');
    const safeCustomer = escapeHtml(customerEmail || '—');
    const safeName = escapeHtml(customerName || '—');
    const safeReiseId = escapeHtml(reisevorschlagId || '');
    const safeAmount = amount != null ? escapeHtml(amount) : '—';
    const safeCurrency = escapeHtml((currency || 'eur').toUpperCase());

    const reiseBlock = isRdT && reisevorschlagId
      ? `<p><strong>Reisevorschlag des Tages ID:</strong> ${safeReiseId}</p>`
      : '';

    const formNote = hasFormData(formData)
      ? '<p>Im Anhang finden Sie das ausgefüllte Kundenformular als PDF.</p>'
      : '<p>Kein Kundenformular (Reisevorschlag des Tages oder Direktbestellung).</p>';

    const html = `
      <h2>Neue bezahlte Bestellung</h2>
      <p><strong>Dienstleistung:</strong> ${safeProduct}</p>
      <p><strong>Bestellnummer:</strong> ${safeOrder}</p>
      ${reiseBlock}
      <p><strong>Kunde (E-Mail):</strong> ${safeCustomer}</p>
      <p><strong>Kunde (Name):</strong> ${safeName}</p>
      <p><strong>Betrag:</strong> ${safeAmount} ${safeCurrency}</p>
      ${formNote}
    `;

    const textLines = [
      'Neue bezahlte Bestellung',
      `Dienstleistung: ${productName || 'Travel Faden'}`,
      `Bestellnummer: ${voucherNumber || '—'}`,
    ];
    if (isRdT && reisevorschlagId) {
      textLines.push(`Reisevorschlag des Tages ID: ${reisevorschlagId}`);
    }
    textLines.push(
      `Kunde: ${customerEmail || '—'}`,
      `Name: ${customerName || '—'}`,
      `Betrag: ${amount != null ? amount : '—'} ${(currency || 'eur').toUpperCase()}`,
      hasFormData(formData) ? 'Formular im PDF-Anhang.' : 'Kein Kundenformular.'
    );

    const subjectParts = [`Neue Bestellung ${voucherNumber}`];
    if (isRdT && reisevorschlagId) {
      subjectParts.push(reisevorschlagId);
    } else {
      subjectParts.push(productName || 'Travel Faden');
    }

    const payload = {
      from: FROM_EMAIL,
      to: [CONTACT_EMAIL],
      reply_to: customerEmail || CONTACT_EMAIL,
      subject: subjectParts.join(' – '),
      html,
      text: textLines.join('\n'),
    };

    if (hasFormData(formData)) {
      const pdfBuffer = await generateFormPdfBuffer({
        productName,
        voucherNumber,
        customerEmail,
        amount,
        currency,
        formData,
      });
      const safeFilename = String(voucherNumber || 'unbekannt').replace(/[^\w-]/g, '');
      payload.attachments = [
        {
          filename: `Formular-${safeFilename}.pdf`,
          content: pdfBuffer,
        },
      ];
    }

    const data = await resend.emails.send(payload);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/** @deprecated Verwende sendAdminNewOrderEmail */
async function sendAdminFormPdfEmail(params) {
  return sendAdminNewOrderEmail({ ...params, isRdT: false });
}

module.exports = {
  sendAdminNewOrderEmail,
  sendAdminFormPdfEmail,
};
