const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'contact@example.com';
const SITE_URL = process.env.SITE_URL || 'https://ganz-neon.vercel.app';

function generateVoucherNumber() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `TF-${timestamp}-${random}`;
}

function createPurchaseConfirmationEmail(
  voucherNumber,
  amount,
  currency,
  customerEmail,
  customerName = null,
  reisevorschlagId = null
) {
  const name = customerName || customerEmail.split('@')[0];
  const reiseBlock = reisevorschlagId
    ? `<p><strong>Reisevorschlag-ID:</strong> ${reisevorschlagId}</p>`
    : '';

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
      <h1>🎉 Vielen Dank für Ihren Kauf!</h1>
      <p>Travel Faden</p>
    </div>
    <div class="content">
      <p>Guten Tag ${name},</p>
      <p>Ihre Zahlung wurde erfolgreich abgeschlossen. Hier sind Ihre Bestelldaten:</p>
      ${reiseBlock}
      
      <div class="voucher-box">
        <div style="font-size: 14px; color: #666; margin-bottom: 10px;">BESTELLNUMMER</div>
        <div class="voucher-number">${voucherNumber}</div>
        <div style="font-size: 14px; color: #666; margin-top: 20px;">BETRAG</div>
        <div class="voucher-amount">${amount} ${currency.toUpperCase()}</div>
      </div>
      
      <p>Wir bereiten Ihren Reisevorschlag vor und senden Ihnen die Buchungslinks innerhalb von 1–3 Werktagen per E-Mail.</p>
      
      <p style="text-align: center;">
        <a href="${SITE_URL}/oferta-dnia-nav.html" class="button">Weitere Reisevorschläge</a>
      </p>
      
      <p><strong>Wie geht es weiter?</strong></p>
      <ul>
        <li>Sie erhalten die Recherche und Links zur eigenständigen Buchung bei den Anbietern</li>
        <li>Bei Fragen antworten Sie einfach auf diese E-Mail oder nutzen Sie unser Kontaktformular</li>
      </ul>
      
      <p>Bei Fragen erreichen Sie uns unter: ${CONTACT_EMAIL}</p>
      
      <div class="footer">
        <p>Travel Faden</p>
        <p>Diese E-Mail wurde automatisch versendet. Bitte antworten Sie nicht direkt auf diese Absenderadresse, sofern nicht anders angegeben.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

function buildPurchaseConfirmationSubject(voucherNumber, reisevorschlagId = null) {
  return reisevorschlagId
    ? `Travel Faden – Bestätigung ${reisevorschlagId}`
    : `Travel Faden – Bestätigung ${voucherNumber}`;
}

module.exports = {
  generateVoucherNumber,
  createPurchaseConfirmationEmail,
  buildPurchaseConfirmationSubject,
};
