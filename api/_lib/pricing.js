/**
 * Serverseitige Preisliste – einzige Quelle für Checkout-Validierung.
 * Bei Preisänderungen: hier + data-amount / priceMap in den HTML-Seiten anpassen.
 */
const RDT_AMOUNT = 60;

const SERVICE_PRICING = [
  {
    id: 'rdt',
    match: (name) => /Reisevorschlag des Tages/i.test(name || ''),
    amounts: [RDT_AMOUNT],
  },
  {
    id: 'flights',
    match: (name) => /Flüge|Fluege/i.test(name || ''),
    amounts: [70, 110, 150, 190],
  },
  {
    id: 'accommodation',
    match: (name) => /Unterkünfte|Unterkunft/i.test(name || ''),
    amounts: [70, 110, 150, 190],
  },
  {
    id: 'citybreak',
    match: (name) => /City Break|Kurztrip/i.test(name || ''),
    amounts: [90, 130, 170, 210],
  },
  {
    id: 'custom',
    match: (name) => /Reise auf Sie zugeschnitten|individuell/i.test(name || ''),
    amounts: [110, 160, 210, 260],
  },
];

function isReisevorschlagDesTages(productName, reisevorschlagId) {
  return Boolean(reisevorschlagId) || /Reisevorschlag des Tages/i.test(productName || '');
}

function validateCheckoutPrice(amount, productName, reisevorschlagId = null) {
  const num = Number(amount);
  if (!Number.isFinite(num) || num <= 0 || !Number.isInteger(num)) {
    return { ok: false, error: 'Ungültiger Betrag' };
  }

  if (isReisevorschlagDesTages(productName, reisevorschlagId)) {
    if (num !== RDT_AMOUNT) {
      return { ok: false, error: 'Ungültiger Betrag für Reisevorschlag des Tages' };
    }
    return { ok: true, amount: num, serviceId: 'rdt' };
  }

  const rule = SERVICE_PRICING.find((entry) => entry.id !== 'rdt' && entry.match(productName || ''));
  if (!rule) {
    return { ok: false, error: 'Unbekannte Dienstleistung' };
  }
  if (!rule.amounts.includes(num)) {
    return { ok: false, error: 'Betrag passt nicht zur gewählten Dienstleistung' };
  }

  return { ok: true, amount: num, serviceId: rule.id };
}

function validateFormTravelersAgainstBooking(formData) {
  if (!formData || typeof formData !== 'object') {
    return { ok: true };
  }

  const hasTravelerFields =
    formData.adults !== undefined ||
    formData.children !== undefined ||
    formData.bookedPersonCount !== undefined;

  if (!hasTravelerFields) {
    return { ok: true };
  }

  const booked = parseInt(formData.bookedPersonCount, 10);
  const adults = parseInt(formData.adults, 10);
  const children = parseInt(formData.children, 10);

  if (!Number.isFinite(booked) || booked < 1 || booked > 8) {
    return { ok: false, error: 'Fehlende oder ungültige gewählte Personenanzahl' };
  }
  if (!Number.isFinite(adults) || adults < 0) {
    return { ok: false, error: 'Ungültige Anzahl der Erwachsenen im Formular' };
  }
  if (!Number.isFinite(children) || children < 0) {
    return { ok: false, error: 'Ungültige Anzahl der Kinder im Formular' };
  }
  if (adults < 1) {
    return { ok: false, error: 'Mindestens ein Erwachsener ist im Formular erforderlich' };
  }

  const travelerTotal = adults + children;
  if (travelerTotal !== booked) {
    return {
      ok: false,
      error: `Die Reisendenanzahl im Formular (${travelerTotal}) muss genau der gewählten Personenanzahl (${booked}) entsprechen`,
    };
  }

  return { ok: true };
}

module.exports = {
  RDT_AMOUNT,
  SERVICE_PRICING,
  validateCheckoutPrice,
  validateFormTravelersAgainstBooking,
};
