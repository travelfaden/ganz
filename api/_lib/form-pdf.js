const PDFDocument = require('pdfkit');

const SKIP_FORM_FIELDS = new Set([
  'withdrawal-consent',
  'agb-consent',
  'privacy-consent',
  'understandCheckbox',
]);

const FIELD_LABELS = {
  firstName: 'Vorname',
  email: 'E-Mail',
  phone: 'Telefon',
  destination: 'Reiseziel',
  travelPeriod: 'Zeitraum der Reise',
  flexibleDates: 'Sind Ihre Reisedaten flexibel',
  tripDuration: 'Reisedauer',
  adults: 'Anzahl der Erwachsenen',
  children: 'Anzahl der Kinder',
  childrenAge: 'Alter des Kindes/der Kinder',
  budget: 'Budget (pro Person, EUR)',
  departureLocation: 'Bevorzugter Abflughafen',
  directFlightsOnly: 'Nur Direktflüge',
  maxTransfers: 'Maximale Anzahl der Umstiege (eine Richtung)',
  preferredFlightTimes: 'Bevorzugte Flugzeiten',
  preferredAirlines: 'Bevorzugte Fluggesellschaften',
  accommodationType: 'Unterkunftsart',
  accommodationRating: 'Standard der Unterkunft',
  mealPlan: 'Verpflegung',
  location: 'Lage der Unterkunft',
  accommodationAmenities: 'Ausstattung der Unterkunft',
  preferences: 'Zusätzliche Informationen',
};

function formatFieldValue(value) {
  if (Array.isArray(value)) return value.join(', ');
  if (value === true || value === 'on') return 'Ja';
  return String(value ?? '').trim();
}

function generateFormPdfBuffer({
  productName,
  voucherNumber,
  customerEmail,
  amount,
  currency,
  formData,
}) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const chunks = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.fontSize(20).fillColor('#2563eb').text('Travel Faden', { align: 'left' });
    doc.moveDown(0.3);
    doc.fontSize(14).fillColor('#0f172a').text('Kundenformular', { underline: true });
    doc.moveDown(1);

    doc.fontSize(11).fillColor('#334155');
    doc.text(`Dienstleistung: ${productName || '—'}`);
    doc.text(`Bestellnummer: ${voucherNumber || '—'}`);
    doc.text(`E-Mail (Stripe): ${customerEmail || '—'}`);
    if (amount) {
      doc.text(`Betrag: ${amount} ${(currency || 'eur').toUpperCase()}`);
    }
    doc.text(`Erstellt am: ${new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' })}`);
    doc.moveDown(1);

    doc.fontSize(13).fillColor('#0f172a').text('Formulardaten', { underline: true });
    doc.moveDown(0.6);

    const entries = Object.entries(formData || {}).filter(([key]) => !SKIP_FORM_FIELDS.has(key));

    if (entries.length === 0) {
      doc.fontSize(11).fillColor('#64748b').text('Keine Formulardaten vorhanden.');
    } else {
      entries.forEach(([key, value]) => {
        const label = FIELD_LABELS[key] || key;
        const text = formatFieldValue(value);
        if (!text) return;

        doc.fontSize(11).fillColor('#0f172a').text(`${label}:`, { continued: false });
        doc.fontSize(11).fillColor('#475569').text(text, { width: 500 });
        doc.moveDown(0.5);
      });
    }

    doc.end();
  });
}

function sanitizeFormData(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;

  const cleaned = {};
  for (const [key, value] of Object.entries(raw)) {
    if (SKIP_FORM_FIELDS.has(key)) continue;
    if (typeof key !== 'string' || key.length > 80) continue;

    if (Array.isArray(value)) {
      cleaned[key] = value
        .map((item) => String(item).slice(0, 2000))
        .filter(Boolean)
        .slice(0, 20);
    } else if (typeof value === 'string') {
      cleaned[key] = value.slice(0, 5000);
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      cleaned[key] = value;
    }
  }

  return Object.keys(cleaned).length > 0 ? cleaned : null;
}

module.exports = {
  generateFormPdfBuffer,
  sanitizeFormData,
  SKIP_FORM_FIELDS,
};
