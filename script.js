// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
});

// Dropdown menu toggle
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.nav-dropdown').forEach(navDropdown => {
        const dropdownToggle = navDropdown.querySelector('.dropdown-toggle');
        
        if (dropdownToggle) {
            dropdownToggle.addEventListener('click', (e) => {
                // On mobile, toggle dropdown
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    navDropdown.classList.toggle('active');
                }
                // On desktop, allow default behavior (hover)
            });
        }
    });
});

// Close menu when clicking on a link
document.addEventListener('DOMContentLoaded', function() {
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');
    
    if (navMenu && hamburger) {
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                // Close all dropdowns on mobile
                document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
                    dropdown.classList.remove('active');
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
// WAŻNE: Zastąp 'YOUR_PUBLISHABLE_KEY' swoim kluczem publicznym z Stripe Dashboard
// Dla testów możesz użyć: pk_test_51...
// Dla produkcji użyj: pk_live_...
let stripe = null;
let BACKEND_URL = 'http://localhost:3000'; // Zmień na właściwy URL w produkcji

// Inicjalizacja Stripe tylko jeśli jest dostępny
document.addEventListener('DOMContentLoaded', function() {
    if (typeof Stripe !== 'undefined') {
        try {
            stripe = Stripe('YOUR_PUBLISHABLE_KEY'); // Klucz publiczny (publishable key) z Stripe
        } catch (e) {
            console.log('Stripe nie jest dostępny:', e);
        }
    }
});

// Voucher button handlers with Stripe integration
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.voucher-button').forEach(button => {
    // Pomiń przyciski z klasą service-buy-button (obsługiwane przez własny kod w wakacje-dla-ciebie.html)
    if (button.classList.contains('service-buy-button')) {
        return;
    }
    
    button.addEventListener('click', async (e) => {
        // Sprawdź checkboxy z akceptacją (jeśli istnieją)
        const withdrawalConsent = document.getElementById('withdrawal-consent');
        const agbConsent = document.getElementById('agb-consent');
        
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
        
        // Jeśli przycisk jest disabled, nie wykonuj akcji
        if (button.disabled) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }
        
        const amount = e.target.getAttribute('data-amount');
        const button = e.target;
        
        // Disable button and show loading
        button.disabled = true;
        const originalText = button.textContent;
        button.textContent = 'Przetwarzanie...';
        button.style.opacity = '0.6';
        
        try {
            // Tworzenie Checkout Session przez backend
            // WAŻNE: Musisz stworzyć endpoint na backendzie, który utworzy Stripe Checkout Session
            const response = await fetch(`${BACKEND_URL}/api/create-checkout-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: amount,
                    currency: 'eur',
                    productName: `Usługa Travel Faden - ${amount}€`,
                }),
            });

            if (!response.ok) {
                throw new Error('Błąd podczas tworzenia sesji płatności');
            }

            const session = await response.json();

            // Przekierowanie do Stripe Checkout
            const result = await stripe.redirectToCheckout({
                sessionId: session.id
            });

            if (result.error) {
                throw new Error(result.error.message);
            }
        } catch (error) {
            console.error('Błąd:', error);
            alert(`Wystąpił błąd: ${error.message}\n\nUpewnij się, że backend jest skonfigurowany i działa.`);
            
            // Re-enable button
            button.disabled = false;
            button.textContent = originalText;
            button.style.opacity = '1';
        }
    });
    });
});

// Request form submission
const requestForm = document.querySelector('.request-form');
if (requestForm) {
    requestForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Dziękujemy za zapytanie! Skontaktujemy się z Tobą wkrótce z najlepszą ofertą.');
        requestForm.reset();
    });
}

// Contact form submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Dziękujemy za wiadomość! Skontaktujemy się z Tobą wkrótce.');
        contactForm.reset();
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
    section.style.opacity = '0';
    section.style.transition = 'opacity 0.8s ease';
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
            }
        });
    }, { threshold: 0.1 });
    sectionObserver.observe(section);
});

// Live Chat Widget
document.addEventListener('DOMContentLoaded', function() {
    const chatToggle = document.getElementById('chatToggle');
    const chatWidget = document.getElementById('chatWidget');
    const chatClose = document.getElementById('chatClose');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    const chatMessages = document.getElementById('chatMessages');
    
    // Sprawdź, czy elementy chat istnieją
    if (!chatToggle || !chatWidget || !chatClose || !chatInput || !chatSend || !chatMessages) {
        return; // Elementy chat nie istnieją na tej stronie
    }

    // Toggle chat widget
    chatToggle.addEventListener('click', () => {
        chatWidget.classList.add('active');
        chatToggle.classList.add('hidden');
        chatInput.focus();
    });

    chatClose.addEventListener('click', () => {
        chatWidget.classList.remove('active');
        chatToggle.classList.remove('hidden');
    });

    // Send message
    function sendMessage(message, isUser = true) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${isUser ? 'user' : 'bot'}`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        const p = document.createElement('p');
        p.textContent = message;
        contentDiv.appendChild(p);
        
        const timeSpan = document.createElement('span');
        timeSpan.className = 'message-time';
        const now = new Date();
        timeSpan.textContent = now.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.appendChild(contentDiv);
        messageDiv.appendChild(timeSpan);
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Handle send button click
    chatSend.addEventListener('click', () => {
        const message = chatInput.value.trim();
        if (message) {
            sendMessage(message, true);
            chatInput.value = '';
            
            // Simulate bot response (możesz to zastąpić prawdziwą integracją)
            setTimeout(() => {
                const responses = [
                    'Dziękujemy za wiadomość! Skontaktujemy się z Tobą wkrótce.',
                    'Rozumiem. Jak możemy Ci pomóc w planowaniu podróży?',
                    'Świetnie! Opowiedz nam więcej o swoich planach podróży.',
                    'Czy chciałbyś kupić usługę lub złożyć zapytanie o ofertę?',
                ];
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                sendMessage(randomResponse, false);
            }, 1000);
        }
    });

    // Handle Enter key
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            chatSend.click();
        }
    });
});

// Auto-open chat on first visit (optional)
// Możesz to włączyć, jeśli chcesz, żeby chat otwierał się automatycznie
// setTimeout(() => {
//     if (!localStorage.getItem('chatOpened')) {
//         chatToggle.click();
//         localStorage.setItem('chatOpened', 'true');
//     }
// }, 3000);

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
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const isHomePage = currentPage === 'index.html' || currentPage === '' || currentPage === '/';
    
    const baseData = [
        {
            title: 'HOME',
            desc: 'Idealne wakacje dla ciebie - znajdź najlepszą ofertę podróży',
            link: isHomePage ? '#home' : 'index.html#home',
            keywords: 'home strona główna wakacje podróż oferta'
        },
        {
            title: 'O Nas',
            desc: 'Poznaj Travel Faden - Twój zaufany pośrednik podróżniczy',
            link: 'o-nas.html',
            keywords: 'o nas o firmie travel faden pośrednik podróżniczy'
        },
        {
            title: 'Jak to Działa',
            desc: 'Dowiedz się jak działa system usług i wyszukiwania ofert',
            link: isHomePage ? '#how-it-works' : 'index.html#how-it-works',
            keywords: 'jak to działa proces usługa kroki instrukcja'
        },
        {
            title: 'Usługi',
            desc: 'Kup usługę i wykorzystaj ją na dowolną ofertę',
            link: isHomePage ? '#vouchers' : 'index.html#vouchers',
            keywords: 'usługi usługa kup zakup euro'
        },
        {
            title: 'Propozycja Dnia',
            desc: 'Gotowa, starannie opracowana oferta podróży przygotowana na podstawie naszej wiedzy',
            link: 'oferta-dnia.html',
            keywords: 'propozycja dnia oferta dnia gotowa oferta podróż'
        },
        {
            title: 'Podróż dopasowana do Ciebie',
            desc: 'Kompleksowa oferta wakacyjna dopasowana do Twoich potrzeb',
            link: 'wakacje-dla-ciebie.html',
            keywords: 'podróż dopasowana wakacje dla ciebie indywidualna oferta'
        },
        {
            title: 'Loty',
            desc: 'Połączenia lotnicze w przystępnej cenie - szybko i bez stresu',
            link: 'loty.html',
            keywords: 'loty loty samolot połączenia lotnicze bilety lotnicze'
        },
        {
            title: 'Noclegi',
            desc: 'Znajdź idealne miejsce na nocleg w wybranym miejscu',
            link: 'noclegi.html',
            keywords: 'noclegi hotel apartament zakwaterowanie miejsce noclegowe'
        },
        {
            title: 'City Break',
            desc: 'Krótkie wyjazdy do najpiękniejszych miast Europy',
            link: 'city-break.html',
            keywords: 'city break krótkie wyjazdy miasta europa weekend'
        },
        {
            title: 'Złóż Zapytanie',
            desc: 'Masz usługę? Złóż zapytanie o ofertę podróży',
            link: isHomePage ? '#request' : 'index.html#request',
            keywords: 'zapytanie oferta formularz podróż miejsce data'
        },
        {
            title: 'Pytania i Odpowiedzi',
            desc: 'Znajdź odpowiedzi na najczęściej zadawane pytania',
            link: 'pytania-i-odpowiedzi.html',
            keywords: 'pytania odpowiedzi faq pomoc wsparcie'
        },
        {
            title: 'Kontakt',
            desc: 'Skontaktuj się z nami - odpowiemy na wszystkie pytania',
            link: isHomePage ? '#contact' : 'index.html#contact',
            keywords: 'kontakt email wiadomość formularz kontaktowy'
        },
        {
            title: 'AGB',
            desc: 'Zapoznaj się z regulaminem usług Travel Faden',
            link: 'regulamin.html',
            keywords: 'regulamin zasady warunki użytkowania agb'
        }
    ];
    
        return baseData;
    }

    const searchData = getSearchData();

    // Toggle search box
    searchToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        searchBox.classList.add('active');
        // Użyj setTimeout, aby upewnić się, że klasa 'active' została dodana przed focus
        setTimeout(() => {
            searchInput.focus();
        }, 10);
    });

    searchClose.addEventListener('click', () => {
        searchBox.classList.remove('active');
        searchInput.value = '';
        searchResults.innerHTML = '';
    });

    // Close search on outside click
    document.addEventListener('click', (e) => {
        if (!searchContainer.contains(e.target) && searchBox.classList.contains('active')) {
            searchBox.classList.remove('active');
            searchInput.value = '';
            searchResults.innerHTML = '';
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
            searchResults.innerHTML = '<div class="search-no-results">Nie znaleziono wyników</div>';
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
                        // Anchor link - sprawdź czy jesteśmy na stronie głównej
                        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
                        const isHomePage = currentPage === 'index.html' || currentPage === '' || currentPage === '/';
                        
                        if (isHomePage) {
                            const target = document.querySelector(link);
                            if (target) {
                                target.scrollIntoView({ behavior: 'smooth' });
                            }
                        } else {
                            // Przekieruj do strony głównej z sekcją
                            window.location.href = 'index.html' + link;
                        }
                    } else {
                        // It's a page link, navigate to it
                        window.location.href = link;
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
        const faqItem = question.parentElement;
        const isActive = faqItem.classList.contains('active');
        
        // Close all FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            faqItem.classList.add('active');
        }
    });
});

