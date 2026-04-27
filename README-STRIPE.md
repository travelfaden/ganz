# Instrukcja Konfiguracji Stripe dla Travel Faden

## Krok 1: Utwórz konto Stripe

1. Przejdź na https://stripe.com/
2. Zarejestruj się lub zaloguj
3. Przejdź do Dashboard

## Krok 2: Pobierz Klucze API

1. W Stripe Dashboard przejdź do **Developers > API keys**
2. Skopiuj **Publishable key** (zaczyna się od `pk_test_` dla testów lub `pk_live_` dla produkcji)
3. Skopiuj **Secret key** (zaczyna się od `sk_test_` dla testów lub `sk_live_` dla produkcji)

## Krok 3: Konfiguracja Frontendu

1. Otwórz plik `script.js`
2. Znajdź linię:
   ```javascript
   const stripe = Stripe('YOUR_PUBLISHABLE_KEY');
   ```
3. Zastąp `YOUR_PUBLISHABLE_KEY` swoim kluczem publicznym
4. Zmień `BACKEND_URL` na adres Twojego serwera backendowego

## Krok 4: Konfiguracja Backendu

### Opcja A: Node.js/Express (Przykład w `backend-example.js`)

1. Zainstaluj zależności:
   ```bash
   npm install express stripe cors dotenv
   ```

2. Utwórz plik `.env`:
   ```
   STRIPE_SECRET_KEY=sk_test_... (Twój klucz prywatny)
   PORT=3000
   ```

3. Uruchom serwer:
   ```bash
   node backend-example.js
   ```

### Opcja B: Inne technologie

- **PHP**: Użyj Stripe PHP SDK
- **Python**: Użyj Stripe Python SDK
- **Serverless**: Użyj AWS Lambda, Vercel Functions, Netlify Functions

## Krok 5: Testowanie

1. Użyj testowych kart kredytowych Stripe:
   - **Sukces**: `4242 4242 4242 4242`
   - **Odmowa**: `4000 0000 0000 0002`
   - **3D Secure**: `4000 0025 0000 3155`
   - Data wygaśnięcia: dowolna przyszła data
   - CVC: dowolne 3 cyfry
   - ZIP: dowolny kod pocztowy

2. Przetestuj zakup vouchera na stronie

## Krok 6: Produkcja

1. Przełącz się na klucze produkcyjne (`pk_live_` i `sk_live_`)
2. Skonfiguruj webhooki w Stripe Dashboard
3. Dodaj obsługę błędów i logowanie
4. Przetestuj dokładnie przed uruchomieniem

## Ważne Uwagi

⚠️ **NIGDY nie umieszczaj klucza prywatnego (Secret Key) w kodzie frontendowym!**

✅ Klucz publiczny (Publishable Key) jest bezpieczny do użycia w frontendzie

✅ Klucz prywatny (Secret Key) musi być tylko w backendzie

## Pliki

- `script.js` - Integracja Stripe w frontendzie
- `backend-example.js` - Przykład backendu Node.js
- `success.html` - Strona sukcesu płatności
- `cancel.html` - Strona anulowania płatności
- `stripe-config.js` - Dokumentacja konfiguracji

## Wsparcie

- Dokumentacja Stripe: https://stripe.com/docs
- Stripe Dashboard: https://dashboard.stripe.com/
- Testowe karty: https://stripe.com/docs/testing

