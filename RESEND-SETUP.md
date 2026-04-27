# Instrukcja Konfiguracji Resend dla Travel Faden

## 📧 Co zostało dodane?

✅ Integracja z Resend do wysyłania emaili  
✅ Automatyczne wysyłanie emaili z voucherem po udanej płatności  
✅ Endpoint do wysyłania testowych emaili  
✅ Endpoint do obsługi formularza kontaktowego  
✅ Piękny szablon emaila z voucherem  

## 🚀 Krok 1: Załóż konto Resend

1. Przejdź na **https://resend.com/**
2. Kliknij **"Sign Up"** (Zarejestruj się)
3. Wypełnij formularz (możesz użyć darmowego planu)
4. Potwierdź email

## 🔑 Krok 2: Pobierz klucz API

1. Po zalogowaniu przejdź do **API Keys**: https://resend.com/api-keys
2. Kliknij **"Create API Key"**
3. Nadaj nazwę (np. "Travel Faden Production")
4. Skopiuj klucz API (zaczyna się od `re_...`)
   - ⚠️ **WAŻNE**: Skopiuj go teraz, bo nie będzie widoczny później!

## 📝 Krok 3: Skonfiguruj plik .env

Utwórz lub zaktualizuj plik `.env` w głównym katalogu projektu:

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_... (lub sk_live_... dla produkcji)
STRIPE_WEBHOOK_SECRET=whsec_... (opcjonalnie, dla webhooków)

# Resend
RESEND_API_KEY=re_... (twój klucz API z Resend)
FROM_EMAIL=noreply@twoja-domena.pl
CONTACT_EMAIL=twoj-email@example.com

# Serwer
PORT=3000
```

### Uwagi dotyczące FROM_EMAIL:

**Opcja 1: Dla testów (bez weryfikacji domeny)**
```env
FROM_EMAIL=onboarding@resend.dev
```
Resend pozwala używać tego adresu bez weryfikacji, ale ma ograniczenia.

**Opcja 2: Dla produkcji (wymaga weryfikacji domeny)**
```env
FROM_EMAIL=noreply@twoja-domena.pl
```

Aby użyć własnej domeny:
1. Przejdź do **Domains** w Resend Dashboard
2. Kliknij **"Add Domain"**
3. Dodaj swoją domenę (np. `twoja-domena.pl`)
4. Dodaj rekordy DNS zgodnie z instrukcjami
5. Poczekaj na weryfikację (zwykle kilka minut)

## 📦 Krok 4: Zainstaluj zależności

```bash
npm install
```

Lub jeśli Resend nie został zainstalowany:

```bash
npm install resend
```

## ✅ Krok 5: Przetestuj integrację

### Test 1: Uruchom serwer

```bash
node backend-example.js
```

Powinieneś zobaczyć:
```
🚀 Serwer działa na porcie 3000
✅ Resend jest skonfigurowany
```

### Test 2: Wyślij testowy email

Użyj narzędzia jak Postman, curl lub przeglądarki:

**Przez curl:**
```bash
curl -X POST http://localhost:3000/api/send-test-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "twoj-email@example.com",
    "subject": "Test Resend",
    "message": "To jest test!"
  }'
```

**Przez przeglądarkę (użyj rozszerzenia do testowania API):**
- URL: `http://localhost:3000/api/send-test-email`
- Method: `POST`
- Body (JSON):
```json
{
  "to": "twoj-email@example.com",
  "subject": "Test Resend",
  "message": "To jest test!"
}
```

### Test 3: Przetestuj płatność

1. Otwórz stronę w przeglądarce
2. Kliknij "Kup Usługę"
3. Wykonaj testową płatność przez Stripe
4. Po udanej płatności automatycznie otrzymasz email z voucherem! 🎉

## 📧 Jak to działa?

### Automatyczne emaile po płatności

Gdy klient zakończy płatność przez Stripe:
1. Stripe wysyła webhook do `/api/webhook`
2. Backend generuje numer vouchera
3. Backend wysyła email z voucherem do klienta
4. Email zawiera piękny szablon HTML z numerem vouchera

### Endpointy API

#### 1. `/api/send-test-email` (POST)
Wysyła testowy email.

**Request:**
```json
{
  "to": "email@example.com",
  "subject": "Test",
  "message": "Wiadomość testowa"
}
```

#### 2. `/api/send-contact-email` (POST)
Wysyła email z formularza kontaktowego.

**Request:**
```json
{
  "name": "Jan Kowalski",
  "email": "jan@example.com",
  "message": "Chcę się skontaktować..."
}
```

## 🎨 Dostosowanie szablonu emaila

Szablon emaila z voucherem znajduje się w funkcji `createVoucherEmailTemplate()` w `backend-example.js`.

Możesz zmienić:
- Kolory
- Tekst
- Logo
- Linki
- Style CSS

## 🔒 Bezpieczeństwo

⚠️ **NIGDY nie commituj pliku `.env` do Git!**

Upewnij się, że `.env` jest w `.gitignore`:
```
.env
.env.local
.env.production
```

## 📊 Limity Resend

**Darmowy plan:**
- 3,000 emaili/miesiąc
- 100 emaili/dzień
- Wystarczy na start!

**Płatny plan (od $20/mies):**
- 50,000 emaili/miesiąc
- Więcej funkcji

## 🆘 Rozwiązywanie problemów

### Problem: "Resend nie jest skonfigurowany"
**Rozwiązanie:** Sprawdź czy dodałeś `RESEND_API_KEY` do pliku `.env`

### Problem: Email nie przychodzi
**Rozwiązanie:**
1. Sprawdź folder SPAM
2. Sprawdź logi w konsoli serwera
3. Sprawdź Resend Dashboard → Logs

### Problem: "Invalid API key"
**Rozwiązanie:** Upewnij się, że skopiowałeś pełny klucz API (zaczyna się od `re_`)

### Problem: "Domain not verified"
**Rozwiązanie:** 
- Użyj `onboarding@resend.dev` dla testów
- Lub zweryfikuj swoją domenę w Resend Dashboard

## 📚 Przydatne linki

- **Resend Dashboard**: https://resend.com/overview
- **Dokumentacja Resend**: https://resend.com/docs
- **API Keys**: https://resend.com/api-keys
- **Domains**: https://resend.com/domains
- **Logs**: https://resend.com/emails

## ✅ Checklist

- [ ] Założone konto Resend
- [ ] Pobrany klucz API
- [ ] Dodany `RESEND_API_KEY` do `.env`
- [ ] Ustawiony `FROM_EMAIL` w `.env`
- [ ] Ustawiony `CONTACT_EMAIL` w `.env`
- [ ] Zainstalowany pakiet: `npm install`
- [ ] Przetestowany testowy email
- [ ] Przetestowana płatność z automatycznym emailem

---

**Gotowe!** 🎉 Teraz Twoja strona automatycznie wysyła emaile z voucherami po każdej udanej płatności!
