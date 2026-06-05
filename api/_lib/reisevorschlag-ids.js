/** Bekannte Reisevorschlag des Tages IDs – bei neuer Angebotsseite hier + script.js ergänzen */
const VALID_REISEVORSCHLAG_IDS = {
  'TF-MALLORCA-12092026': { title: 'Mallorca' },
  'TF-KRETA-12092026': { title: 'Kreta' },
};

function normalizeReisevorschlagId(id) {
  return String(id || '').trim().toUpperCase();
}

function isValidReisevorschlagId(id) {
  const normalized = normalizeReisevorschlagId(id);
  return Boolean(normalized && VALID_REISEVORSCHLAG_IDS[normalized]);
}

module.exports = {
  VALID_REISEVORSCHLAG_IDS,
  normalizeReisevorschlagId,
  isValidReisevorschlagId,
};
