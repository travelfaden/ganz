const { CONTACT_EMAIL } = require('./email-config');

function getEmailHeaderLogoBlock() {
  return `
              <table role="presentation" cellspacing="0" cellpadding="0" align="center" style="margin:0 auto 18px;">
                <tr>
                  <td style="vertical-align:middle;padding-right:10px;">
                    <svg width="40" height="40" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="display:block;">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#ffffff" stroke-width="3"/>
                      <circle cx="50" cy="50" r="35" fill="none" stroke="rgba(255,255,255,0.65)" stroke-width="2"/>
                      <line x1="15" y1="30" x2="85" y2="30" stroke="#ffffff" stroke-width="1.5"/>
                      <line x1="15" y1="50" x2="85" y2="50" stroke="#ffffff" stroke-width="1.5"/>
                      <line x1="15" y1="70" x2="85" y2="70" stroke="#ffffff" stroke-width="1.5"/>
                      <path d="M 50 10 Q 50 30, 50 50 Q 50 70, 50 90" fill="none" stroke="#ffffff" stroke-width="1.5"/>
                      <g transform="translate(50, 50) rotate(45)">
                        <path d="M -15 -5 L 15 -5 L 10 0 L 15 5 L -15 5 L -10 0 Z" fill="#ffffff"/>
                        <circle cx="0" cy="0" r="3" fill="#ffffff"/>
                      </g>
                    </svg>
                  </td>
                  <td style="vertical-align:middle;">
                    <span style="font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.02em;line-height:1;">Travel<span style="display:inline-block;width:0.04em;"></span>Faden</span>
                  </td>
                </tr>
              </table>`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function createPurchaseConfirmationEmail(
  voucherNumber,
  amount,
  currency,
  customerEmail,
  customerName = null,
  reisevorschlagId = null
) {
  const name = escapeHtml(customerName || customerEmail.split('@')[0]);
  const orderId = escapeHtml(voucherNumber);
  const reiseId = escapeHtml(reisevorschlagId || '—');
  const contact = escapeHtml(CONTACT_EMAIL);

  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bestellbestätigung – Travel Faden</title>
</head>
<body style="margin:0;padding:0;background-color:#eef2f7;font-family:Arial,Helvetica,sans-serif;color:#1e293b;line-height:1.65;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#eef2f7;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px rgba(15,23,42,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,#2563eb 0%,#0ea5e9 100%);padding:26px 28px 22px;text-align:center;">
              ${getEmailHeaderLogoBlock()}
              <h1 style="margin:0;font-size:22px;font-weight:700;color:#ffffff;line-height:1.35;text-align:center;">Vielen Dank für Ihre Bestellung</h1>
            </td>
          </tr>

          <tr>
            <td style="padding:36px 32px 8px;">
              <p style="margin:0 0 16px;font-size:16px;color:#334155;">Guten Tag <strong>${name}</strong>,</p>
              <p style="margin:0 0 16px;font-size:16px;color:#334155;">Vielen Dank für Ihre Bestellung bei <strong>Travel Faden</strong>.</p>
              <p style="margin:0;font-size:16px;color:#334155;">Ihre Zahlung wurde erfolgreich abgeschlossen. Hier sind Ihre Bestelldaten:</p>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 32px 8px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;">
                <tr>
                  <td style="padding:20px 22px;border-bottom:1px solid #e2e8f0;">
                    <p style="margin:0 0 6px;font-size:12px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#64748b;">Reisevorschlag des Tages ID</p>
                    <p style="margin:0;font-size:18px;font-weight:700;color:#2563eb;font-family:Consolas,Monaco,'Courier New',monospace;word-break:break-all;">${reiseId}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:20px 22px;">
                    <p style="margin:0 0 6px;font-size:12px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#64748b;">Bestellnummer</p>
                    <p style="margin:0;font-size:18px;font-weight:700;color:#0f172a;font-family:Consolas,Monaco,'Courier New',monospace;word-break:break-all;">${orderId}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 32px 8px;">
              <h2 style="margin:0 0 14px;font-size:18px;color:#0f172a;">Wie geht es weiter?</h2>
              <p style="margin:0 0 14px;font-size:15px;color:#475569;">Wir beginnen nun mit der Recherche und Zusammenstellung der vollständigen Informationen zu diesem Reisevorschlag.</p>
              <p style="margin:0 0 12px;font-size:15px;color:#475569;">Innerhalb von <strong>1 bis 3 Tagen</strong> erhalten Sie von uns eine E-Mail mit:</p>
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 0 18px;">
                <tr>
                  <td style="padding:4px 0;font-size:15px;color:#475569;vertical-align:top;width:18px;">•</td>
                  <td style="padding:4px 0 4px 8px;font-size:15px;color:#475569;">den recherchierten Informationen,</td>
                </tr>
                <tr>
                  <td style="padding:4px 0;font-size:15px;color:#475569;vertical-align:top;width:18px;">•</td>
                  <td style="padding:4px 0 4px 8px;font-size:15px;color:#475569;">den entsprechenden Buchungslinks,</td>
                </tr>
                <tr>
                  <td style="padding:4px 0;font-size:15px;color:#475569;vertical-align:top;width:18px;">•</td>
                  <td style="padding:4px 0 4px 8px;font-size:15px;color:#475569;">sowie weiteren relevanten Details zum ausgewählten Reisevorschlag.</td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:8px 32px 24px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#fffbeb;border:1px solid #fde68a;border-radius:10px;">
                <tr>
                  <td style="padding:16px 18px;">
                    <p style="margin:0 0 10px;font-size:14px;color:#92400e;">Bitte beachten Sie, dass Preise und Verfügbarkeiten sich nach Veröffentlichung des Reisevorschlags ändern können.</p>
                    <p style="margin:0;font-size:14px;color:#92400e;">Sollte die ursprünglich veröffentlichte Option nicht mehr verfügbar sein oder der Preis um mehr als 20&nbsp;% gestiegen sein, gelten die entsprechenden Regelungen gemäß unseren AGB.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:8px 32px 28px;">
              <p style="margin:0 0 24px;font-size:15px;color:#475569;">Bei Fragen können Sie uns jederzeit unter <a href="mailto:${contact}" style="color:#2563eb;text-decoration:none;font-weight:600;">${contact}</a> kontaktieren.</p>
              <p style="margin:0 0 4px;font-size:15px;color:#334155;">Mit freundlichen Grüßen</p>
              <p style="margin:0 0 2px;font-size:16px;font-weight:700;color:#0f172a;">Travel Faden</p>
              <p style="margin:0;font-size:15px;color:#475569;">Bartosz Nagiec</p>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 32px 28px;background-color:#f8fafc;border-top:1px solid #e2e8f0;">
              <p style="margin:0;font-size:12px;line-height:1.6;color:#94a3b8;text-align:center;">Diese E-Mail wurde automatisch versendet. Bitte antworten Sie nicht direkt auf diese Absenderadresse, sofern nicht anders angegeben.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

function createPurchaseConfirmationPlainText(
  voucherNumber,
  customerEmail,
  customerName = null,
  reisevorschlagId = null
) {
  const name = customerName || customerEmail.split('@')[0];
  const reiseId = reisevorschlagId || '—';

  return `Guten Tag ${name},

Vielen Dank für Ihre Bestellung bei Travel Faden.

Ihre Zahlung wurde erfolgreich abgeschlossen. Hier sind Ihre Bestelldaten:

Reisevorschlag des Tages ID:
${reiseId}

Bestellnummer:
${voucherNumber}

Wie geht es weiter?
Wir beginnen nun mit der Recherche und Zusammenstellung der vollständigen Informationen zu diesem Reisevorschlag.
Innerhalb von 1 bis 3 Tagen erhalten Sie von uns eine E-Mail mit:
• den recherchierten Informationen,
• den entsprechenden Buchungslinks,
• sowie weiteren relevanten Details zum ausgewählten Reisevorschlag.

Bitte beachten Sie, dass Preise und Verfügbarkeiten sich nach Veröffentlichung des Reisevorschlags ändern können.
Sollte die ursprünglich veröffentlichte Option nicht mehr verfügbar sein oder der Preis um mehr als 20 % gestiegen sein, gelten die entsprechenden Regelungen gemäß unseren AGB.

Bei Fragen können Sie uns jederzeit unter ${CONTACT_EMAIL} kontaktieren.

Mit freundlichen Grüßen
Travel Faden
Bartosz Nagiec

Diese E-Mail wurde automatisch versendet. Bitte antworten Sie nicht direkt auf diese Absenderadresse, sofern nicht anders angegeben.`;
}

function buildPurchaseConfirmationSubject(voucherNumber, reisevorschlagId = null) {
  return reisevorschlagId
    ? `Travel Faden – Bestätigung ${reisevorschlagId}`
    : `Travel Faden – Bestätigung ${voucherNumber}`;
}

function buildServicePurchaseConfirmationSubject(voucherNumber) {
  return `Travel Faden – Bestätigung ${voucherNumber}`;
}

function isReisevorschlagDesTagesOrder(reisevorschlagId, productName = null) {
  return Boolean(reisevorschlagId) || /Reisevorschlag des Tages/i.test(productName || '');
}

function getEmailFooterBlock(contact) {
  return `
          <tr>
            <td style="padding:20px 32px 28px;background-color:#f8fafc;border-top:1px solid #e2e8f0;">
              <p style="margin:0;font-size:12px;line-height:1.6;color:#94a3b8;text-align:center;">Diese E-Mail wurde automatisch versendet. Bitte antworten Sie nicht direkt auf diese Absenderadresse, sofern nicht anders angegeben.</p>
            </td>
          </tr>`;
}

function createServicePurchaseConfirmationEmail(
  voucherNumber,
  customerEmail,
  customerName = null
) {
  const name = escapeHtml(customerName || customerEmail.split('@')[0]);
  const orderId = escapeHtml(voucherNumber);
  const contact = escapeHtml(CONTACT_EMAIL);

  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bestellbestätigung – Travel Faden</title>
</head>
<body style="margin:0;padding:0;background-color:#eef2f7;font-family:Arial,Helvetica,sans-serif;color:#1e293b;line-height:1.65;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#eef2f7;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px rgba(15,23,42,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,#2563eb 0%,#0ea5e9 100%);padding:26px 28px 22px;text-align:center;">
              ${getEmailHeaderLogoBlock()}
              <h1 style="margin:0;font-size:22px;font-weight:700;color:#ffffff;line-height:1.35;text-align:center;">Vielen Dank für Ihre Bestellung</h1>
            </td>
          </tr>

          <tr>
            <td style="padding:36px 32px 8px;">
              <p style="margin:0 0 16px;font-size:16px;color:#334155;">Guten Tag <strong>${name}</strong>,</p>
              <p style="margin:0 0 16px;font-size:16px;color:#334155;">Vielen Dank für Ihre Bestellung bei <strong>Travel Faden</strong>.</p>
              <p style="margin:0 0 16px;font-size:16px;color:#334155;">Wir haben Ihre Anfrage sowie die von Ihnen übermittelten Informationen erfolgreich erhalten.</p>
              <p style="margin:0;font-size:16px;color:#334155;">Ihre Zahlung wurde erfolgreich abgeschlossen. Hier sind Ihre Bestelldaten:</p>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 32px 8px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;">
                <tr>
                  <td style="padding:20px 22px;">
                    <p style="margin:0 0 6px;font-size:12px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#64748b;">Bestellnummer</p>
                    <p style="margin:0;font-size:18px;font-weight:700;color:#0f172a;font-family:Consolas,Monaco,'Courier New',monospace;word-break:break-all;">${orderId}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 32px 8px;">
              <h2 style="margin:0 0 14px;font-size:18px;color:#0f172a;">Wie geht es weiter?</h2>
              <p style="margin:0 0 14px;font-size:15px;color:#475569;">Unser Team beginnt nun mit der Bearbeitung Ihrer Anfrage. Die Recherche erfolgt auf Grundlage der von Ihnen angegebenen Wünsche und Informationen.</p>
              <p style="margin:0 0 14px;font-size:15px;color:#475569;">Die Bearbeitungszeit beträgt je nach gewählter Dienstleistung zwischen <strong>1 und 14 Tagen</strong>.</p>
              <p style="margin:0;font-size:15px;color:#475569;">Sobald Ihre Recherche abgeschlossen ist, erhalten Sie die Ergebnisse per E-Mail.</p>
            </td>
          </tr>

          <tr>
            <td style="padding:8px 32px 24px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#fffbeb;border:1px solid #fde68a;border-radius:10px;">
                <tr>
                  <td style="padding:16px 18px;">
                    <p style="margin:0;font-size:14px;color:#92400e;">Bitte beachten Sie, dass es sich bei unseren Leistungen um Recherche- und Informationsdienstleistungen handelt. Buchungen erfolgen eigenständig durch den Kunden bei den jeweiligen Anbietern.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:8px 32px 28px;">
              <p style="margin:0 0 24px;font-size:15px;color:#475569;">Bei Fragen können Sie uns jederzeit unter <a href="mailto:${contact}" style="color:#2563eb;text-decoration:none;font-weight:600;">${contact}</a> kontaktieren.</p>
              <p style="margin:0 0 4px;font-size:15px;color:#334155;">Mit freundlichen Grüßen</p>
              <p style="margin:0 0 2px;font-size:16px;font-weight:700;color:#0f172a;">Travel Faden</p>
              <p style="margin:0;font-size:15px;color:#475569;">Bartosz Nagiec</p>
            </td>
          </tr>

          ${getEmailFooterBlock(contact)}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

function createServicePurchaseConfirmationPlainText(
  voucherNumber,
  customerEmail,
  customerName = null
) {
  const name = customerName || customerEmail.split('@')[0];

  return `Guten Tag ${name},

Vielen Dank für Ihre Bestellung bei Travel Faden.

Wir haben Ihre Anfrage sowie die von Ihnen übermittelten Informationen erfolgreich erhalten.

Ihre Zahlung wurde erfolgreich abgeschlossen. Hier sind Ihre Bestelldaten:

Bestellnummer:
${voucherNumber}

Wie geht es weiter?
Unser Team beginnt nun mit der Bearbeitung Ihrer Anfrage. Die Recherche erfolgt auf Grundlage der von Ihnen angegebenen Wünsche und Informationen.
Die Bearbeitungszeit beträgt je nach gewählter Dienstleistung zwischen 1 und 14 Tagen.

Sobald Ihre Recherche abgeschlossen ist, erhalten Sie die Ergebnisse per E-Mail.

Bitte beachten Sie, dass es sich bei unseren Leistungen um Recherche- und Informationsdienstleistungen handelt. Buchungen erfolgen eigenständig durch den Kunden bei den jeweiligen Anbietern.

Bei Fragen können Sie uns jederzeit unter ${CONTACT_EMAIL} kontaktieren.

Mit freundlichen Grüßen
Travel Faden
Bartosz Nagiec

Diese E-Mail wurde automatisch versendet. Bitte antworten Sie nicht direkt auf diese Absenderadresse, sofern nicht anders angegeben.`;
}

module.exports = {
  createPurchaseConfirmationEmail,
  createPurchaseConfirmationPlainText,
  createServicePurchaseConfirmationEmail,
  createServicePurchaseConfirmationPlainText,
  buildPurchaseConfirmationSubject,
  buildServicePurchaseConfirmationSubject,
  isReisevorschlagDesTagesOrder,
};
