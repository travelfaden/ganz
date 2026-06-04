(function () {
    const DATA_URL = 'data/angebote.json';
    const PREVIEW_URL = 'http://localhost:3000/oferta-dnia-nav.html';

    function localPreviewHint() {
        return `<div style="max-width:560px;margin:2rem auto;padding:1.25rem 1.5rem;background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;text-align:left;line-height:1.65;color:#1e3a5f;">
            <strong>Lokalny podgląd ofert</strong><br>
            Otwarcie strony z dysku (<code>file://</code>) nie ładuje pliku <code>data/angebote.json</code>.<br><br>
            W terminalu (folder strony):<br>
            <code style="display:block;margin:0.6rem 0;padding:0.5rem 0.75rem;background:#fff;border-radius:6px;font-size:0.95rem;">npm run preview</code>
            Następnie w przeglądarce:<br>
            <a href="${PREVIEW_URL}" style="color:#2563eb;font-weight:600;">${PREVIEW_URL}</a><br>
            <span style="font-size:0.9rem;color:#64748b;">Szczegóły: <a href="http://localhost:3000/angebot.html?slug=mallorca">angebot.html?slug=mallorca</a></span>
        </div>`;
    }

    function isLocalFileProtocol() {
        return window.location.protocol === 'file:';
    }

    function escapeHtml(text) {
        if (text == null) return '';
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function offerDetailUrl(slug) {
        return `angebot.html?slug=${encodeURIComponent(slug)}`;
    }

    async function loadOffers() {
        const response = await fetch(DATA_URL);
        if (!response.ok) {
            throw new Error('angebote.json konnte nicht geladen werden');
        }
        const data = await response.json();
        return (data.offers || []).filter((o) => o.slug && o.active !== false);
    }

    function renderOfferCard(offer) {
        return `
            <article class="daily-offer-card">
                <div class="daily-offer-image">
                    <img src="${escapeHtml(offer.image)}" alt="${escapeHtml(offer.imageAlt || offer.destination)}" width="320" height="240" loading="lazy">
                </div>
                <div class="daily-offer-content">
                    <h2 class="daily-offer-destination">${escapeHtml(offer.destination)}</h2>
                    <ul class="daily-offer-details">
                        <li><span class="daily-offer-emoji" aria-hidden="true">📅</span> ${escapeHtml(offer.dateRange)}</li>
                        <li><span class="daily-offer-emoji" aria-hidden="true">✈️</span> ${escapeHtml(offer.departure)}</li>
                        <li><span class="daily-offer-emoji" aria-hidden="true">🌙</span> ${escapeHtml(offer.duration)}</li>
                        <li><span class="daily-offer-emoji" aria-hidden="true">💰</span> ${escapeHtml(offer.priceHint)}</li>
                    </ul>
                    <a href="${offerDetailUrl(offer.slug)}" class="daily-offer-cta">Reisevorschlag ansehen</a>
                </div>
            </article>`;
    }

    async function initOffersList() {
        const root = document.getElementById('daily-offers-list');
        if (!root) return;

        if (isLocalFileProtocol()) {
            root.innerHTML = localPreviewHint();
            return;
        }

        try {
            const offers = await loadOffers();
            if (offers.length === 0) {
                root.innerHTML = '<p style="text-align:center;color:var(--text-light);">Derzeit keine Angebote.</p>';
                return;
            }
            root.innerHTML = offers.map(renderOfferCard).join('');
        } catch (err) {
            console.error(err);
            root.innerHTML = localPreviewHint();
        }
    }

    async function initOfferDetail() {
        const root = document.getElementById('angebot-detail-root');
        if (!root) return;

        if (isLocalFileProtocol()) {
            root.innerHTML = localPreviewHint();
            return;
        }

        const slug = new URLSearchParams(window.location.search).get('slug');
        if (!slug) {
            root.innerHTML = '<p style="padding:2rem;text-align:center;">Kein Angebot ausgewählt. <a href="oferta-dnia-nav.html">Zur Übersicht</a></p>';
            return;
        }

        try {
            const offers = await loadOffers();
            const offer = offers.find((o) => o.slug === slug);
            if (!offer) {
                document.title = 'Angebot nicht gefunden | Travel Faden';
                root.innerHTML = '<p style="padding:2rem;text-align:center;">Dieses Angebot wurde nicht gefunden. <a href="oferta-dnia-nav.html">Zur Übersicht</a></p>';
                return;
            }

            document.title = `${offer.destination} – Reisevorschlag des Tages | Travel Faden`;

            const hero = document.getElementById('angebot-hero');
            if (hero) {
                hero.style.backgroundImage = `url('${offer.image.replace(/'/g, "\\'")}')`;
            }
            const heroTitle = document.getElementById('angebot-hero-title');
            if (heroTitle) heroTitle.textContent = offer.destination;

            const meta = document.getElementById('angebot-meta-grid');
            if (meta) {
                meta.innerHTML = `
                    <div class="angebot-meta-item"><span>📅</span><div><strong>Zeitraum</strong><br>${escapeHtml(offer.dateRange)}</div></div>
                    <div class="angebot-meta-item"><span>✈️</span><div><strong>Abflug</strong><br>${escapeHtml(offer.departure.replace(/^Ab\s+/i, ''))}</div></div>
                    <div class="angebot-meta-item"><span>🌙</span><div><strong>Dauer</strong><br>${escapeHtml(offer.duration)}</div></div>
                    <div class="angebot-meta-item"><span>💰</span><div><strong>Preis</strong><br>${escapeHtml(offer.priceHint)}</div></div>`;
            }

            const desc = document.getElementById('angebot-description');
            if (desc) {
                const paragraphs = offer.description || [];
                desc.innerHTML = paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join('');
            }

            root.style.display = '';
        } catch (err) {
            console.error(err);
            root.innerHTML = localPreviewHint();
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        initOffersList();
        initOfferDetail();
    });
})();
