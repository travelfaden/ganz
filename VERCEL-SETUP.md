# 🚀 Instrukcja Deploy na Vercel - Travel Faden

## ✅ Co zostało zrobione?

Twoja strona została przygotowana do działania na Vercel **BEZ potrzeby uruchamiania serwera**!

✅ Utworzone funkcje serverless w folderze `/api`  
✅ Każdy endpoint to osobna funkcja Vercel  
✅ Automatyczna konfiguracja CORS  
✅ Gotowe do deploy!  

## 📁 Struktura plików

```
twoja-strona/
├── api/
│   ├── create-checkout-session.js  ← Endpoint Stripe
│   ├── verify-session.js            ← Weryfikacja płatności
│   ├── webhook.js                   ← Webhook Stripe + emaile
│   ├── send-test-email.js           ← Test emaili
│   └── send-contact-email.js        ← Formularz kontaktowy
├── index.html
├── script.js
├── package.json
├── vercel.json                      ← Konfiguracja Vercel
└── ... (pozostałe pliki)
```

## 🚀 Krok 1: Zainstaluj Vercel CLI (opcjonalnie)

```bash
npm install -g vercel
```

Lub możesz deployować przez **Vercel Dashboard** (bez CLI).

## 📝 Krok 2: Przygotuj zmienne środowiskowe

Przed deployem przygotuj listę zmiennych środowiskowych:

```env
STRIPE_SECRET_KEY=sk_live_... (lub sk_test_...)
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
FROM_EMAIL=noreply@twoja-domena.pl
CONTACT_EMAIL=twoj-email@example.com
```

## 🌐 Krok 3: Deploy na Vercel

### Opcja A: Przez Vercel Dashboard (NAJŁATWIEJSZE)

1. **Zaloguj się** na https://vercel.com/
2. Kliknij **"Add New Project"**
3. **Połącz repozytorium** (GitHub/GitLab/Bitbucket) lub **Upload** folder
4. Vercel automatycznie wykryje projekt
5. **Dodaj zmienne środowiskowe:**
   - Przejdź do **Settings → Environment Variables**
   - Dodaj wszystkie zmienne z listy powyżej
6. Kliknij **"Deploy"**

### Opcja B: Przez Vercel CLI

```bash
# Zaloguj się
vercel login

# Deploy
vercel

# Dla produkcji
vercel --prod
```

Podczas deployu Vercel zapyta o zmienne środowiskowe - możesz je dodać teraz lub później w Dashboard.

## ⚙️ Krok 4: Skonfiguruj zmienne środowiskowe w Vercel

1. Przejdź do projektu w **Vercel Dashboard**
2. Kliknij **Settings → Environment Variables**
3. Dodaj wszystkie zmienne:

| Nazwa | Wartość | Przykład |
|-------|---------|----------|
| `STRIPE_SECRET_KEY` | Twój klucz Stripe | `sk_live_51...` |
| `STRIPE_WEBHOOK_SECRET` | Secret webhooka | `whsec_...` |
| `RESEND_API_KEY` | Klucz Resend | `re_...` |
| `FROM_EMAIL` | Email nadawcy | `noreply@twoja-domena.pl` |
| `CONTACT_EMAIL` | Twój email | `twoj-email@example.com` |

4. Kliknij **"Save"**
5. **Redeploy** projektu (Settings → Deployments → Redeploy)

## 🔗 Krok 5: Zaktualizuj frontend

W pliku `script.js` zmień `BACKEND_URL` na URL Twojego projektu Vercel:

```javascript
// Zamiast:
let BACKEND_URL = 'http://localhost:3000';

// Użyj:
let BACKEND_URL = 'https://twoja-strona.vercel.app';
// lub
let BACKEND_URL = 'https://twoja-domena.pl'; // jeśli masz custom domain
```

## 🔔 Krok 6: Skonfiguruj Webhook Stripe

1. Przejdź do **Stripe Dashboard → Developers → Webhooks**
2. Kliknij **"Add endpoint"**
3. **Endpoint URL:** `https://twoja-strona.vercel.app/api/webhook`
4. Wybierz eventy:
   - `checkout.session.completed`
5. Kliknij **"Add endpoint"**
6. Skopiuj **Signing secret** (zaczyna się od `whsec_`)
7. Dodaj do zmiennych środowiskowych w Vercel jako `STRIPE_WEBHOOK_SECRET`

## ✅ Krok 7: Przetestuj

### Test 1: Sprawdź endpointy

Otwórz w przeglądarce:
- `https://twoja-strona.vercel.app/api/verify-session?sessionId=test`
- Powinieneś zobaczyć odpowiedź (błąd jest OK, to tylko test)

### Test 2: Testowy email

Użyj narzędzia jak Postman lub curl:

```bash
curl -X POST https://twoja-strona.vercel.app/api/send-test-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "twoj-email@example.com",
    "subject": "Test",
    "message": "Test z Vercel!"
  }'
```

### Test 3: Pełna płatność

1. Otwórz stronę na Vercel
2. Kliknij "Kup Usługę"
3. Wykonaj testową płatność
4. Sprawdź czy email z voucherem przyszedł! 🎉

## 🎯 Jak to działa?

### Tradycyjny serwer vs Vercel

**Tradycyjny serwer:**
```
Serwer działa 24/7 → Ciągle zużywa zasoby → Kosztuje
```

**Vercel Serverless:**
```
Funkcja uruchamia się TYLKO gdy ktoś wywołuje endpoint → Płacisz za użycie → Darmowe dla małych projektów!
```

### Endpointy API

Wszystkie endpointy są dostępne pod:
- `https://twoja-strona.vercel.app/api/create-checkout-session`
- `https://twoja-strona.vercel.app/api/verify-session`
- `https://twoja-strona.vercel.app/api/webhook`
- `https://twoja-strona.vercel.app/api/send-test-email`
- `https://twoja-strona.vercel.app/api/send-contact-email`

## 💰 Koszty Vercel

**Darmowy plan (Hobby):**
- ✅ 100GB bandwidth/miesiąc
- ✅ Nieograniczone requesty
- ✅ Automatyczne HTTPS
- ✅ Custom domains
- ✅ **Wystarczy dla większości projektów!**

**Płatny plan (Pro - $20/mies):**
- Więcej bandwidth
- Więcej funkcji
- Priorytetowe wsparcie

## 🔧 Rozwiązywanie problemów

### Problem: "Function timeout"
**Rozwiązanie:** Webhook ma już ustawiony `maxDuration: 30` w `vercel.json`

### Problem: "Environment variable not found"
**Rozwiązanie:** 
1. Sprawdź czy dodałeś zmienne w Vercel Dashboard
2. Upewnij się, że zrobiłeś redeploy po dodaniu zmiennych

### Problem: CORS errors
**Rozwiązanie:** Wszystkie funkcje mają już skonfigurowane CORS headers

### Problem: Webhook nie działa
**Rozwiązanie:**
1. Sprawdź czy URL webhooka w Stripe jest poprawny
2. Sprawdź czy `STRIPE_WEBHOOK_SECRET` jest ustawiony
3. Sprawdź logi w Vercel Dashboard → Functions → Logs

## 📊 Monitoring

Vercel Dashboard pokazuje:
- ✅ Liczbę requestów
- ✅ Czas odpowiedzi
- ✅ Błędy
- ✅ Logi funkcji

Przejdź do: **Dashboard → Twoja strona → Functions**

## 🎉 Gotowe!

Twoja strona działa na Vercel **BEZ potrzeby uruchamiania serwera**!

Wszystko działa automatycznie:
- ✅ Płatności Stripe
- ✅ Automatyczne emaile z voucherami
- ✅ Formularz kontaktowy
- ✅ Webhooki

**Nie musisz już uruchamiać `node backend-example.js`!** 🚀

---

## 📚 Przydatne linki

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Dokumentacja Vercel**: https://vercel.com/docs
- **Vercel Functions**: https://vercel.com/docs/functions
- **Environment Variables**: https://vercel.com/docs/concepts/projects/environment-variables
