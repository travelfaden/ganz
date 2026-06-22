function updateHamburgerA11y(hamburger, isOpen) {
    hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    hamburger.setAttribute('aria-label', isOpen ? 'Menü schließen' : 'Menü öffnen');
}

// Podgląd file:// – zamiana /czyste-url na pliki .html (Vercel bez zmian)
function isFilePreview() {
    return window.location.protocol === 'file:';
}

function toLocalHref(href) {
    if (!href || !isFilePreview()) return href;
    if (href.startsWith('//')) return href;

    let pathOnly = href;
    let hashPart = '';
    let queryPart = '';

    const hashIndex = pathOnly.indexOf('#');
    if (hashIndex >= 0) {
        hashPart = pathOnly.slice(hashIndex);
        pathOnly = pathOnly.slice(0, hashIndex);
    }

    const queryIndex = pathOnly.indexOf('?');
    if (queryIndex >= 0) {
        queryPart = pathOnly.slice(queryIndex);
        pathOnly = pathOnly.slice(0, queryIndex);
    }

    if (pathOnly === '/' || pathOnly === '/index.html') {
        return 'index.html' + queryPart + hashPart;
    }

    if (pathOnly.startsWith('/#')) {
        return 'index.html' + pathOnly.slice(1) + queryPart + hashPart;
    }

    if (pathOnly.startsWith('/')) {
        const slug = pathOnly.slice(1);
        if (!slug) return 'index.html' + queryPart + hashPart;
        if (/\.[a-z0-9]+$/i.test(slug)) return slug + queryPart + hashPart;
        return slug + '.html' + queryPart + hashPart;
    }

    return href;
}

function isHomePageContext() {
    if (isFilePreview()) {
        return /index\.html$/i.test(window.location.pathname);
    }
    const path = window.location.pathname.replace(/\/$/, '') || '/';
    return path === '/' || path === '/index.html';
}

function fixFilePreviewLinks() {
    if (!isFilePreview()) return;

    document.querySelectorAll('a[href^="/"]').forEach((anchor) => {
        const href = anchor.getAttribute('href');
        if (href && !href.startsWith('//')) {
            anchor.setAttribute('href', toLocalHref(href));
        }
    });

    document.querySelectorAll('link[href^="/"]').forEach((link) => {
        const href = link.getAttribute('href');
        if (href) link.setAttribute('href', href.slice(1));
    });
}

function initFilePreviewNavigation() {
    if (!isFilePreview()) return;

    fixFilePreviewLinks();

    document.addEventListener('click', (event) => {
        const anchor = event.target.closest('a[href]');
        if (!anchor) return;

        const href = anchor.getAttribute('href');
        if (!href || href.startsWith('//')) return;
        if (/^(https?:|mailto:|tel:)/i.test(href)) return;
        if (!href.startsWith('/')) return;

        event.preventDefault();
        window.location.href = toLocalHref(href);
    }, true);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFilePreviewNavigation);
} else {
    initFilePreviewNavigation();
}

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
            updateHamburgerA11y(hamburger, navMenu.classList.contains('active'));

            if (!navMenu.classList.contains('active')) {
                document.querySelectorAll('.nav-dropdown').forEach((dropdown) => {
                    dropdown.classList.remove('active');
                    const toggle = dropdown.querySelector('.dropdown-toggle');
                    if (toggle) toggle.setAttribute('aria-expanded', 'false');
                });
            }
        });
    }
});

// Dropdown menu toggle
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.nav-dropdown').forEach(navDropdown => {
        const dropdownToggle = navDropdown.querySelector('.dropdown-toggle');
        
        if (dropdownToggle) {
            dropdownToggle.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    e.stopPropagation();
                    const isOpen = navDropdown.classList.toggle('active');
                    dropdownToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
                    dropdownToggle.blur();
                }
            });
        }
    });
});

// Close menu when clicking on a link
document.addEventListener('DOMContentLoaded', function() {
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');
    
    if (navMenu && hamburger) {
        document.querySelectorAll('.nav-menu a:not(.dropdown-toggle)').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                updateHamburgerA11y(hamburger, false);
                document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
                    dropdown.classList.remove('active');
                    const toggle = dropdown.querySelector('.dropdown-toggle');
                    if (toggle) toggle.setAttribute('aria-expanded', 'false');
                });
            });
        });
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        
        // Special handling for Home - scroll to top of page
        if (href === '#home') {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else {
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.background = 'var(--bg-color)';
        navbar.style.backdropFilter = 'none';
    }
});

// Stripe Configuration
let stripe = null;
let BACKEND_URL = typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
  ? window.location.origin
  : 'http://localhost:3000';

function collectPageConsents() {
    const consentIds = ['withdrawal-consent', 'agb-consent', 'privacy-consent'];
    const collected = [];

    consentIds.forEach((id) => {
        const input = document.getElementById(id);
        if (!input) return;

        const label = document.querySelector(`label[for="${id}"]`);
        collected.push({
            id,
            label: label ? label.innerText.replace(/\s+/g, ' ').trim() : id,
            checked: Boolean(input.checked),
        });
    });

    return collected;
}

/** Reisevorschlag des Tages IDs (rid in URL) – auch in api/_lib/reisevorschlag-ids.js pflegen */
const VALID_REISEVORSCHLAG_IDS = {
    'TF-MALLORCA-12092026': { title: 'Mallorca' },
    'TF-KRETA-12092026': { title: 'Kreta' },
};

function serializeTravelForm(form) {
    const data = {};
    const fd = new FormData(form);
    for (const [key, value] of fd.entries()) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            const prev = data[key];
            data[key] = Array.isArray(prev) ? [...prev, value] : [prev, value];
        } else {
            data[key] = value;
        }
    }
    return data;
}

window.travelFadenSerializeForm = serializeTravelForm;

function validateTravelerCountForBooking(personCount, adults, children) {
    const booked = parseInt(personCount, 10);
    const adultsNum = parseInt(adults, 10);
    const childrenNum = parseInt(children, 10);
    const personLabel = booked === 1 ? 'Person' : 'Personen';

    if (!Number.isFinite(booked) || booked < 1 || booked > 8) {
        return { ok: false, message: 'Ungültige Personenanzahl.' };
    }
    if (!Number.isFinite(adultsNum) || adultsNum < 0) {
        return { ok: false, message: 'Bitte geben Sie eine gültige Anzahl der Erwachsenen an.' };
    }
    if (!Number.isFinite(childrenNum) || childrenNum < 0) {
        return { ok: false, message: 'Bitte geben Sie eine gültige Anzahl der Kinder an.' };
    }
    if (adultsNum < 1) {
        return {
            ok: false,
            message: `Sie haben ${booked} ${personLabel} gewählt. Bitte geben Sie mindestens einen Erwachsenen an.`,
        };
    }

    const travelerTotal = adultsNum + childrenNum;
    if (travelerTotal !== booked) {
        return {
            ok: false,
            message:
                `Sie haben ${booked} ${personLabel} gewählt. ` +
                `Erwachsene und Kinder im Formular müssen zusammen genau ${booked} ergeben ` +
                `(aktuell: ${travelerTotal}).`,
        };
    }

    return { ok: true, bookedPersonCount: booked, travelerTotal };
}

function updateTravelerCountErrorDisplay() {
    const personCountEl = document.getElementById('personCount');
    const adultsEl = document.getElementById('adults');
    const childrenEl = document.getElementById('children');
    const errorEl = document.getElementById('traveler-count-error');
    if (!personCountEl || !adultsEl || !childrenEl || !errorEl) return;

    const check = validateTravelerCountForBooking(
        personCountEl.value,
        adultsEl.value,
        childrenEl.value
    );

    if (check.ok) {
        errorEl.textContent = '';
        errorEl.hidden = true;
        adultsEl.removeAttribute('aria-invalid');
        childrenEl.removeAttribute('aria-invalid');
        adultsEl.style.borderColor = '';
        childrenEl.style.borderColor = '';
        return;
    }

    errorEl.textContent = check.message;
    errorEl.hidden = false;
    adultsEl.setAttribute('aria-invalid', 'true');
    childrenEl.setAttribute('aria-invalid', 'true');
    adultsEl.style.borderColor = '#ef4444';
    childrenEl.style.borderColor = '#ef4444';
}

function initTravelerCountLiveValidation() {
    const personCountEl = document.getElementById('personCount');
    const adultsEl = document.getElementById('adults');
    const childrenEl = document.getElementById('children');
    if (!personCountEl || !adultsEl || !childrenEl) return;
    if (adultsEl.dataset.travelerValidationInit === 'true') return;

    const formRow = adultsEl.closest('.form-row');
    if (!formRow) return;

    let errorEl = document.getElementById('traveler-count-error');
    if (!errorEl) {
        errorEl = document.createElement('p');
        errorEl.id = 'traveler-count-error';
        errorEl.className = 'traveler-count-error';
        errorEl.setAttribute('role', 'alert');
        errorEl.hidden = true;
        formRow.insertAdjacentElement('afterend', errorEl);
    }

    const refresh = () => updateTravelerCountErrorDisplay();
    ['input', 'change'].forEach((evt) => {
        adultsEl.addEventListener(evt, refresh);
        childrenEl.addEventListener(evt, refresh);
        personCountEl.addEventListener(evt, refresh);
    });

    adultsEl.dataset.travelerValidationInit = 'true';
    refresh();
}

window.travelFadenValidateTravelerCount = validateTravelerCountForBooking;
window.travelFadenInitTravelerCountValidation = initTravelerCountLiveValidation;
window.travelFadenRefreshTravelerCountValidation = updateTravelerCountErrorDisplay;

function readStoredTravelFormData() {
    try {
        const raw = sessionStorage.getItem('travelFormData');
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === 'object' ? parsed : null;
    } catch (_) {
        return null;
    }
}

async function recordConsentAndCreateSession(amount, productName, consents, reisevorschlagId = null, formData = null) {
    let consentId = null;

    if (consents.length > 0) {
        let consentResponse;
        try {
            consentResponse = await fetch(`${BACKEND_URL}/api/record-consent`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount,
                    currency: 'eur',
                    productName,
                    consents,
                    reisevorschlagId: reisevorschlagId || undefined,
                    formData: formData || undefined,
                }),
            });
        } catch (error) {
            throw new Error(
                'Die Einwilligungen konnten nicht gespeichert werden. Bitte versuchen Sie es später erneut.'
            );
        }

        if (!consentResponse.ok) {
            let msg = 'Die Einwilligungen konnten nicht gespeichert werden.';
            try {
                const err = await consentResponse.json();
                msg = err.message || err.error || msg;
            } catch (_) {}
            throw new Error(msg);
        }

        const consentData = await consentResponse.json();
        consentId = consentData.consentId;
        if (!consentId) {
            throw new Error('Die Einwilligungen konnten nicht gespeichert werden.');
        }
    }

    const sessionResponse = await fetch(`${BACKEND_URL}/api/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            amount,
            currency: 'eur',
            productName,
            consentId,
            reisevorschlagId: reisevorschlagId || undefined,
        }),
    });

    if (!sessionResponse.ok) {
        let msg = 'Checkout konnte nicht gestartet werden.';
        try {
            const err = await sessionResponse.json();
            msg = err.message || err.error || msg;
        } catch (_) {}
        throw new Error(msg);
    }

    return sessionResponse.json();
}

window.travelFadenStartCheckout = async function (amount, productName, loadingButton) {
    if (!stripe) {
        alert('Zahlungssystem nicht geladen. Bitte die Seite neu laden.');
        return;
    }
    const btn = loadingButton || null;
    const originalText = btn ? btn.textContent : '';
    if (btn) {
        btn.disabled = true;
        btn.textContent = 'Wird geladen...';
        btn.style.opacity = '0.65';
    }
    try {
        const consents = collectPageConsents();
        const formData = readStoredTravelFormData();
        const session = await recordConsentAndCreateSession(
            amount,
            productName || `Travel Faden - ${amount}€`,
            consents,
            null,
            formData
        );
        sessionStorage.removeItem('travelFormData');
        const result = await stripe.redirectToCheckout({ sessionId: session.id });
        if (result.error) {
            throw new Error(result.error.message);
        }
    } catch (error) {
        console.error('travelFadenStartCheckout:', error);
        alert(`Fehler: ${error.message}`);
        if (btn) {
            btn.disabled = false;
            btn.textContent = originalText;
            btn.style.opacity = '1';
        }
    }
};

document.addEventListener('DOMContentLoaded', function() {
    if (typeof Stripe !== 'undefined') {
        try {
            stripe = Stripe('pk_test_51SpXfA0v0hpavs4B6yGcGGwLa6z3vVlwhFAPRGNc46570wwT9OMUWirrYrf3y74nh9oBdC5lQKQB9C17UccPRIyc00cIywttqE', { locale: 'de' });
        } catch (e) {
            console.log('Stripe nie jest dostępny:', e);
        }
    }
    initTravelerCountLiveValidation();
});

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.voucher-button').forEach(button => {
    if (button.tagName === 'A') {
        return;
    }
    if (button.classList.contains('service-buy-button')) {
        return;
    }
    
    button.addEventListener('click', async (e) => {
        const button = e.currentTarget;
        const amount = button.getAttribute('data-amount');
        
        const withdrawalConsent = document.getElementById('withdrawal-consent');
        const agbConsent = document.getElementById('agb-consent');
        const privacyConsent = document.getElementById('privacy-consent');
        
        if (withdrawalConsent && !withdrawalConsent.checked) {
            e.preventDefault();
            e.stopPropagation();
            alert('Bitte akzeptieren Sie die Widerrufsrechtsvereinbarung, um fortzufahren.');
            withdrawalConsent.focus();
            return;
        }
        
        if (agbConsent && !agbConsent.checked) {
            e.preventDefault();
            e.stopPropagation();
            alert('Bitte akzeptieren Sie die AGB, um fortzufahren.');
            agbConsent.focus();
            return;
        }

        if (privacyConsent && !privacyConsent.checked) {
            e.preventDefault();
            e.stopPropagation();
            alert('Bitte akzeptieren Sie die Datenschutzerklärung, um fortzufahren.');
            privacyConsent.focus();
            return;
        }
        
        if (button.disabled) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }
        
        button.disabled = true;
        const originalText = button.textContent;
        button.textContent = 'Wird geladen...';
        button.style.opacity = '0.6';
        
        try {
            const consents = collectPageConsents();
            const reiseId = button.getAttribute('data-reise-id');
            const productName = reiseId
                ? `Reisevorschlag des Tages - ${reiseId}`
                : `Travel Faden – Dienstleistung ${amount}€`;
            const session = await recordConsentAndCreateSession(
                amount,
                productName,
                consents,
                reiseId || null
            );

            const result = await stripe.redirectToCheckout({
                sessionId: session.id
            });

            if (result.error) {
                throw new Error(result.error.message);
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert(`Fehler: ${error.message}\n\nBitte versuchen Sie es erneut oder laden Sie die Seite neu.`);
            
            button.disabled = false;
            button.textContent = originalText;
            button.style.opacity = '1';
        }
    });
    });
});

// Contact form submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    const getGermanValidationMessage = (field) => {
        if (field.id === 'privacy-checkbox') {
            return 'Bitte akzeptieren Sie die Datenschutzerklärung.';
        }
        if (field.type === 'email') {
            if (field.validity.valueMissing) {
                return 'Bitte geben Sie Ihre E-Mail-Adresse ein.';
            }
            if (field.validity.typeMismatch) {
                return 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
            }
        }
        if (field.tagName === 'TEXTAREA') {
            return 'Bitte geben Sie Ihre Nachricht ein.';
        }
        if (field.type === 'text') {
            return 'Bitte geben Sie Ihren Namen ein.';
        }
        return 'Bitte füllen Sie dieses Feld aus.';
    };

    const contactFields = contactForm.querySelectorAll('input, textarea');
    contactFields.forEach((field) => {
        field.addEventListener('invalid', () => {
            field.setCustomValidity(getGermanValidationMessage(field));
        });

        field.addEventListener('input', () => {
            field.setCustomValidity('');
        });

        field.addEventListener('change', () => {
            field.setCustomValidity('');
        });
    });

    function showContactFormStatus(message, type) {
        const statusEl = document.getElementById('contactFormStatus');
        if (!statusEl) return;
        statusEl.textContent = message;
        statusEl.className = `contact-form-status contact-form-status--${type}`;
        statusEl.hidden = false;
    }

    function clearContactFormStatus() {
        const statusEl = document.getElementById('contactFormStatus');
        if (!statusEl) return;
        statusEl.textContent = '';
        statusEl.className = 'contact-form-status';
        statusEl.hidden = true;
    }

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearContactFormStatus();
        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }

        const nameInput = contactForm.querySelector('#contact-name');
        const emailInput = contactForm.querySelector('#contact-email');
        const messageInput = contactForm.querySelector('#contact-message');
        const submitBtn = contactForm.querySelector('.submit-button');
        const originalText = submitBtn ? submitBtn.textContent : '';

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Wird gesendet...';
            submitBtn.style.opacity = '0.65';
        }

        try {
            const response = await fetch(`${BACKEND_URL}/api/send-contact-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: nameInput?.value.trim(),
                    email: emailInput?.value.trim(),
                    message: messageInput?.value.trim(),
                }),
            });

            if (!response.ok) {
                let msg = 'Die Nachricht konnte nicht gesendet werden.';
                try {
                    const err = await response.json();
                    msg = err.error || err.message || msg;
                } catch (_) {}
                throw new Error(msg);
            }

            contactForm.reset();
            showContactFormStatus(
                'Vielen Dank für Ihre Nachricht! Wir melden uns in Kürze bei Ihnen.',
                'success'
            );
        } catch (error) {
            showContactFormStatus(`Fehler: ${error.message}`, 'error');
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                submitBtn.style.opacity = '1';
            }
        }
    });
}

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe service cards
document.querySelectorAll('.service-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `all 0.6s ease ${index * 0.1}s`;
    observer.observe(card);
});

// Observe section headings
document.querySelectorAll('.section h2').forEach(heading => {
    if (heading.closest('.regulamin, .faq-container, .service-main-content')) {
        return;
    }
    heading.style.opacity = '0';
    heading.style.transform = 'translateY(-20px)';
    heading.style.transition = 'all 0.8s ease';
    observer.observe(heading);
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Add smooth fade-in for sections
document.querySelectorAll('.section').forEach(section => {
    if (section.querySelector('.regulamin, .faq-container, .service-details')) {
        return;
    }
    section.style.opacity = '0';
    section.style.transition = 'opacity 0.8s ease';
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                sectionObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0 });
    sectionObserver.observe(section);
});

// Search Functionality - inicjalizacja po załadowaniu DOM
function initSearch() {
    const searchContainer = document.querySelector('.search-container');
    const searchToggle = document.getElementById('searchToggle');
    const searchBox = document.getElementById('searchBox');
    const searchInput = document.getElementById('searchInput');
    const searchClose = document.getElementById('searchClose');
    const searchResults = document.getElementById('searchResults');
    
    // Sprawdź, czy wszystkie elementy istnieją
    if (!searchContainer || !searchToggle || !searchBox || !searchInput || !searchClose || !searchResults) {
        // Elementy wyszukiwania nie istnieją na tej stronie - to normalne dla niektórych stron
        return;
    }
    
    // Sprawdź, czy event listener już nie został dodany
    if (searchToggle.hasAttribute('data-search-initialized')) {
        return; // Już zainicjalizowane
    }
    searchToggle.setAttribute('data-search-initialized', 'true');

    // Search data - sekcje strony do wyszukiwania
    // Funkcja zwracająca dane wyszukiwania w zależności od aktualnej strony
    function getSearchData() {
        const path = window.location.pathname.replace(/\/$/, '') || '/';
        const isHomePage = path === '/' || path === '/index.html';
    
    const baseData = [
        {
            title: 'HOME',
            desc: 'Idealne Ferien für Sie - finden Sie das beste Reiseangebot',
            link: isHomePage ? '#home' : '/#home',
            keywords: 'home startseite ferien reise angebot'
        },
        {
            title: 'Über uns',
            desc: 'Lernen Sie Travel Faden kennen - Ihr vertrauensvoller Reisevermittler',
            link: '/ueber-uns',
            keywords: 'über uns über die firma travel faden reisevermittler'
        },
        {
            title: 'So funktioniert es',
            desc: 'Erfahren Sie, wie das System der Dienstleistungen und Angebotssuche funktioniert',
            link: isHomePage ? '#how-it-works' : '/#how-it-works',
            keywords: 'so funktioniert es prozess dienstleistung schritte anleitung'
        },
        {
            title: 'Unsere Leistungen',
            desc: 'Kaufen Sie eine Dienstleistung und nutzen Sie sie für jedes Angebot',
            link: isHomePage ? '#vouchers' : '/#vouchers',
            keywords: 'dienstleistungen dienstleistung kaufen kauf euro'
        },
        {
            title: 'Tagesvorschlag',
            desc: 'Fertiges, sorgfältig ausgearbeitetes Reiseangebot basierend auf unserem Wissen',
            link: '/reisevorschlag-des-tages',
            keywords: 'tagesvorschlag tagesangebot fertiges angebot reise'
        },
        {
            title: 'Reise auf Sie zugeschnitten',
            desc: 'Umfassendes Urlaubsangebot, das auf Ihre Bedürfnisse zugeschnitten ist',
            link: '/individueller-reisevorschlag',
            keywords: 'reise zugeschnitten ferien für sie individuelles angebot'
        },
        {
            title: 'Flüge',
            desc: 'Flugverbindungen zu erschwinglichen Preisen - schnell und ohne Stress',
            link: '/flugvorschlaege',
            keywords: 'flüge flugzeug flugverbindungen flugtickets'
        },
        {
            title: 'Unterkünfte',
            desc: 'Finden Sie die perfekte Unterkunft am gewählten Ort',
            link: '/unterkunftsvorschlaege',
            keywords: 'unterkünfte hotel apartment unterkunft übernachtung'
        },
        {
            title: 'Kurztrip-Vorschläge',
            desc: 'Kurze Reisen in die schönsten Städte Europas',
            link: '/kurztrip-vorschlaege',
            keywords: 'city break kurze reisen städte europa wochenende'
        },
        {
            title: 'Anfrage stellen',
            desc: 'Haben Sie eine Dienstleistung? Stellen Sie eine Anfrage für ein Reiseangebot',
            link: isHomePage ? '#contact' : '/#contact',
            keywords: 'anfrage angebot formular reise ort datum'
        },
        {
            title: 'FAQ',
            desc: 'Finden Sie Antworten auf häufig gestellte Fragen',
            link: '/faq',
            keywords: 'fragen antworten faq hilfe unterstützung'
        },
        {
            title: 'Kontakt',
            desc: 'Kontaktieren Sie uns - wir beantworten alle Ihre Fragen',
            link: isHomePage ? '#contact' : '/#contact',
            keywords: 'kontakt email nachricht kontaktformular'
        },
        {
            title: 'AGB',
            desc: 'Lesen Sie die Allgemeinen Geschäftsbedingungen der Travel Faden Dienstleistungen',
            link: '/agb',
            keywords: 'agb regeln bedingungen nutzungsbedingungen'
        }
    ];
    
        return baseData;
    }

    const searchData = getSearchData();

    function setSearchOpen(isOpen) {
        searchToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        searchToggle.setAttribute('aria-label', isOpen ? 'Suche schließen' : 'Suche öffnen');
    }

    // Toggle search box
    searchToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        searchBox.classList.add('active');
        setSearchOpen(true);
        // Użyj setTimeout, aby upewnić się, że klasa 'active' została dodana przed focus
        setTimeout(() => {
            searchInput.focus();
        }, 10);
    });

    searchClose.addEventListener('click', () => {
        searchBox.classList.remove('active');
        searchInput.value = '';
        searchResults.innerHTML = '';
        setSearchOpen(false);
    });

    // Close search on outside click
    document.addEventListener('click', (e) => {
        if (!searchContainer.contains(e.target) && searchBox.classList.contains('active')) {
            searchBox.classList.remove('active');
            searchInput.value = '';
            searchResults.innerHTML = '';
            setSearchOpen(false);
        }
    });

    // Highlight matching text
    function highlightText(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    // Search functionality
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        
        if (query.length === 0) {
            searchResults.innerHTML = '';
            return;
        }
        
        // Aktualizuj dane wyszukiwania (na wypadek zmiany strony)
        const currentSearchData = getSearchData();
        
        // Filter results
        const filtered = currentSearchData.filter(item => {
            return item.title.toLowerCase().includes(query) ||
                   item.desc.toLowerCase().includes(query) ||
                   item.keywords.toLowerCase().includes(query);
        });
        
        // Display results
        if (filtered.length === 0) {
            searchResults.innerHTML = '<div class="search-no-results">Keine Ergebnisse gefunden</div>';
        } else {
            searchResults.innerHTML = filtered.map(item => `
                <div class="search-result-item" data-link="${item.link}">
                    <div class="search-result-title">${highlightText(item.title, query)}</div>
                    <div class="search-result-desc">${item.desc}</div>
                </div>
            `).join('');
            
            // Add click handlers
            document.querySelectorAll('.search-result-item').forEach(item => {
                item.addEventListener('click', () => {
                    const link = item.getAttribute('data-link');
                    // Check if it's an anchor link or a page link
                    if (link.startsWith('#')) {
                        if (isHomePageContext()) {
                            const target = document.querySelector(link);
                            if (target) {
                                target.scrollIntoView({ behavior: 'smooth' });
                            }
                        } else {
                            window.location.href = toLocalHref('/' + link);
                        }
                    } else if (link.startsWith('/#')) {
                        window.location.href = toLocalHref(link);
                    } else {
                        window.location.href = toLocalHref(link);
                    }
                    searchBox.classList.remove('active');
                    searchInput.value = '';
                    searchResults.innerHTML = '';
                });
            });
        }
    });

    // Handle Enter key in search
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const firstResult = document.querySelector('.search-result-item');
            if (firstResult) {
                firstResult.click();
            }
        }
    });

    // Close search on Escape
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchBox.classList.remove('active');
            searchInput.value = '';
            searchResults.innerHTML = '';
        }
    });
}

// Inicjalizacja wyszukiwania
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearch);
} else {
    // DOM już załadowany
    initSearch();
}

// FAQ Toggle
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const faqItem = question.closest('.faq-item');
        const isActive = faqItem.classList.contains('active');
        
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
            const btn = item.querySelector('.faq-question');
            if (btn) btn.setAttribute('aria-expanded', 'false');
        });
        
        if (!isActive) {
            faqItem.classList.add('active');
            question.setAttribute('aria-expanded', 'true');
        }
    });
});

