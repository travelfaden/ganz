# 🚀 Prosty Start - Travel Faden

## Opcja 1: Działanie Lokalne (NAJPROSTSZE)

Jeśli nie chcesz używać Vercel, możesz uruchomić wszystko lokalnie:

### Krok 1: Zainstaluj pakiety

```bash
npm install
```

### Krok 2: Utwórz plik `.env`

Utwórz plik `.env` w głównym folderze z zawartością:

```env
STRIPE_SECRET_KEY=sk_test_...
RESEND_API_KEY=re_...
FROM_EMAIL=onboarding@resend.dev
CONTACT_EMAIL=twoj-email@example.com
PORT=3000
```

### Krok 3: Uruchom serwer

```bash
node backend-example.js
```

### Krok 4: Otwórz stronę

Otwórz `index.html` w przeglądarce lub użyj:
- `http://localhost:3000` (jeśli serwer działa)

---

## Opcja 2: Vercel (Bez serwera)

Jeśli chcesz użyć Vercel, ale masz problemy:

### Najprostszy sposób - przez przeglądarkę:

1. **Załóż konto** na https://vercel.com (możesz użyć GitHub)
2. Kliknij **"Add New Project"**
3. **Upload folder** - przeciągnij cały folder projektu
4. **Dodaj zmienne środowiskowe** w ustawieniach
5. Kliknij **"Deploy"**

To wszystko! Vercel zrobi resztę automatycznie.

---

## Opcja 3: Netlify (Alternatywa dla Vercel)

Netlify jest podobny do Vercel, ale może być prostszy:

1. Przejdź na https://netlify.com
2. Zarejestruj się
3. Przeciągnij folder projektu
4. Gotowe!

---

## Co wybrać?

- **Lokalnie** - jeśli testujesz lub nie potrzebujesz publicznego URL
- **Vercel** - jeśli chcesz darmowy hosting + funkcje serverless
- **Netlify** - alternatywa dla Vercel

---

## Potrzebujesz pomocy?

Powiedz mi:
1. Co dokładnie próbujesz zrobić?
2. Na jakim etapie się zatrzymałeś?
3. Jaki błąd widzisz (jeśli jest)?

Pomogę Ci krok po kroku! 😊
