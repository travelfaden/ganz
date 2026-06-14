import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const base = 'https://travelfaden.com';

const pages = {
  'index.html': {
    title: 'Travel Faden – Reisevorschläge & Urlaubsplanung',
    desc: 'Travel Faden: Reisevorschläge des Tages, individuelle Urlaubsplanung, Flug- und Unterkunftsvorschläge. Schnelle Recherche – Buchung direkt beim Anbieter.',
    path: '/',
  },
  'reisevorschlaege.html': {
    title: 'Reisevorschlag des Tages – aktuelle Angebote | Travel Faden',
    desc: 'Aktuelle Reisevorschläge des Tages von Travel Faden: fertige Urlaubsideen mit Flug und Unterkunft. Neue Angebote regelmäßig – einfach auswählen und bestellen.',
    path: '/reisevorschlaege',
  },
  'angebot-kreta.html': {
    title: 'Kreta Reisevorschlag 09/2026 ab Hamburg | Travel Faden',
    desc: 'Reisevorschlag Kreta 12.-16.09.2026 ab Hamburg, 4 Tage ab 299 EUR pro Person. Fertige Urlaubsidee von Travel Faden - Links zur Buchung beim Anbieter.',
    path: '/angebot-kreta',
  },
  'angebot-mallorca.html': {
    title: 'Mallorca Reisevorschlag 09/2026 ab Hamburg | Travel Faden',
    desc: 'Reisevorschlag Mallorca 12.-16.09.2026 ab Hamburg, 4 Tage ab 299 EUR pro Person. Fertige Urlaubsidee von Travel Faden - Links zur Buchung beim Anbieter.',
    path: '/angebot-mallorca',
  },
  'reisevorschlag-des-tages.html': {
    title: 'Reisevorschlag des Tages kaufen | Travel Faden',
    desc: 'Kaufen Sie den Service Reisevorschlag des Tages bei Travel Faden. Nach Zahlung erhalten Sie recherchierte Links zu Flug und Unterkunft – Buchung direkt beim Anbieter.',
    path: '/reisevorschlag-des-tages',
  },
  'individueller-reisevorschlag.html': {
    title: 'Individueller Reisevorschlag – maßgeschneidert | Travel Faden',
    desc: 'Individueller Reisevorschlag von Travel Faden: personalisierte Urlaubsrecherche nach Ihren Wünschen, Budget und Reisedaten. Bearbeitung in 1–14 Tagen.',
    path: '/individueller-reisevorschlag',
  },
  'flugvorschlaege.html': {
    title: 'Flugvorschläge – günstige Verbindungen | Travel Faden',
    desc: 'Flugvorschläge von Travel Faden: wir recherchieren passende Flugverbindungen zu Ihren Wünschen. Sie buchen eigenständig direkt bei der Airline oder dem Anbieter.',
    path: '/flugvorschlaege',
  },
  'unterkunftsvorschlaege.html': {
    title: 'Unterkunftsvorschläge für Ihre Reise | Travel Faden',
    desc: 'Unterkunftsvorschläge von Travel Faden: Hotels und Apartments passend zu Ihrem Reiseziel und Budget. Buchung direkt beim jeweiligen Anbieter.',
    path: '/unterkunftsvorschlaege',
  },
  'kurztrip-vorschlaege.html': {
    title: 'Kurztrip-Vorschläge – Citytrips in Europa | Travel Faden',
    desc: 'Kurztrip-Vorschläge von Travel Faden: kurze Städtereisen in Europa, recherchiert nach Ihren Wünschen. Schnelle Inspiration für Wochenendtrips.',
    path: '/kurztrip-vorschlaege',
  },
  'faq.html': {
    title: 'FAQ – häufige Fragen | Travel Faden',
    desc: 'Antworten auf häufige Fragen zu Travel Faden: Leistungen, Zahlung, Bearbeitungszeit, Reisevorschlag des Tages und individuelle Reisevorschläge.',
    path: '/faq',
  },
  'ueber-uns.html': {
    title: 'Über uns – Travel Faden',
    desc: 'Lernen Sie Travel Faden kennen: Recherche- und Informationsdienstleistungen rund um Reiseoptionen. Kein Reisebüro – Buchung direkt beim Anbieter.',
    path: '/ueber-uns',
  },
  'agb.html': {
    title: 'AGB – Allgemeine Geschäftsbedingungen | Travel Faden',
    desc: 'Allgemeine Geschäftsbedingungen (AGB) von Travel Faden für Recherche- und Informationsdienstleistungen rund um Reiseoptionen.',
    path: '/agb',
  },
  'impressum.html': {
    title: 'Impressum | Travel Faden',
    desc: 'Impressum und Anbieterkennzeichnung von Travel Faden gemäß § 5 TMG.',
    path: '/impressum',
  },
  'datenschutzerklaerung.html': {
    title: 'Datenschutzerklärung | Travel Faden',
    desc: 'Datenschutzerklärung von Travel Faden: Informationen zur Verarbeitung personenbezogener Daten auf travelfaden.com.',
    path: '/datenschutzerklaerung',
  },
  'widerrufsbelehrung.html': {
    title: 'Widerrufsbelehrung | Travel Faden',
    desc: 'Widerrufsbelehrung von Travel Faden zu kostenpflichtigen Recherche- und Informationsdienstleistungen.',
    path: '/widerrufsbelehrung',
  },
};

function escapeHtml(text) {
  return text.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

function buildSeoBlock(meta) {
  const title = escapeHtml(meta.title);
  const desc = escapeHtml(meta.desc);
  const url = base + meta.path;
  return `    <meta name="description" content="${desc}">
    <link rel="canonical" href="${url}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Travel Faden">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${desc}">
    <meta property="og:url" content="${url}">
    <meta property="og:locale" content="de_DE">
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${desc}">`;
}

for (const [file, meta] of Object.entries(pages)) {
  const path = join(root, file);
  if (!existsSync(path)) continue;

  let html = readFileSync(path, 'utf8');
  const seoBlock = buildSeoBlock(meta);

  html = html.replace(/\s*<meta name="description"[^>]*>\s*/g, '\n');
  html = html.replace(/\s*<link rel="canonical"[^>]*>\s*/g, '\n');
  html = html.replace(/\s*<meta property="og:[^"]+"[^>]*>\s*/g, '\n');
  html = html.replace(/\s*<meta name="twitter:[^"]+"[^>]*>\s*/g, '\n');
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${meta.title}</title>`);

  if (!html.includes('<meta name="description"')) {
    html = html.replace('</title>', `</title>\n${seoBlock}`);
  }

  writeFileSync(path, html, 'utf8');
  console.log(`SEO: ${file}`);
}
