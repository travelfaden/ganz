# Instrukcja Testowania Płatności Stripe

## Szybki Start - Test Płatności

### Opcja 1: Test z Backendem (Zalecane)

1. **Pobierz klucze Stripe:**
   - Zaloguj się do [Stripe Dashboard](https://dashboard.stripe.com/)
   - Przejdź do **Developers → API keys**
   - Skopiuj **Publishable key** (zaczyna się od `pk_test_`)
   - Skopiuj **Secret key** (zaczyna się od `sk_test_`)

2. **Zainstaluj zależności:**
   ```bash
   npm install express stripe cors dotenv
   ```

3. **Utwórz plik `.env` w głównym katalogu:**
   ```
   STRIPE_SECRET_KEY=sk_test_TWOJ_KLUCZ_TUTAJ
   PORT=3000
   ```

4. **Uruchom backend:**
   ```bash
   node backend-example.js
   ```
   Powinieneś zobaczyć: `Serwer działa na porcie 3000`

5. **Otwórz stronę testową:**
   - Otwórz plik `test-stripe.html` w przeglądarce
   - Wprowadź swój **Publishable key**
   - Wprowadź kwotę (np. 80)
   - Kliknij "Przetestuj Płatność"

6. **Użyj testowej karty:**
   - Numer karty: `4242 4242 4242 4242`
   - Data wygaśnięcia: dowolna przyszła data (np. `12/25`)
   - CVC: dowolne 3 cyfry (np. `123`)
   - Kod pocztowy: dowolny (np. `12345`)

### Opcja 2: Test bez Backendu (Tylko do testów lokalnych)

⚠️ **UWAGA:** Ta metoda nie jest zalecana dla produkcji, ale może być użyteczna do szybkich testów.

Możesz użyć Stripe CLI do przekierowania webhooków lokalnie:

```bash
# Zainstaluj Stripe CLI: https://stripe.com/docs/stripe-cli
stripe listen --forward-to localhost:3000/api/webhook
```

## Testowe Karty Stripe

| Scenariusz | Numer Karty | Wynik |
|------------|-------------|-------|
| Sukces | `4242 4242 4242 4242` | Płatność zakończona sukcesem |
| Odmowa | `4000 0000 0000 0002` | Płatność odrzucona |
| 3D Secure | `4000 0025 0000 3155` | Wymaga weryfikacji 3D Secure |
| Niewystarczające środki | `4000 0000 0000 9995` | Błąd: niewystarczające środki |

**Wszystkie karty:**
- Data wygaśnięcia: dowolna przyszła data
- CVC: dowolne 3 cyfry
- Kod pocztowy: dowolny

## Rozwiązywanie Problemów

### Błąd: "Backend nie odpowiada"
- Upewnij się, że backend jest uruchomiony (`node backend-example.js`)
- Sprawdź, czy port 3000 jest wolny
- Sprawdź, czy plik `.env` istnieje i zawiera `STRIPE_SECRET_KEY`

### Błąd: "Invalid API Key"
- Sprawdź, czy klucz zaczyna się od `pk_test_` (dla testów)
- Upewnij się, że nie ma spacji w kluczu
- Skopiuj klucz ponownie z Stripe Dashboard

### Błąd: "CORS"
- Backend powinien mieć włączony CORS (już jest w `backend-example.js`)
- Upewnij się, że otwierasz `test-stripe.html` przez `http://localhost` lub `file://`

## Następne Kroki

Po pomyślnym teście:

1. **Skonfiguruj klucz w `script.js`:**
   ```javascript
   stripe = Stripe('pk_test_TWOJ_KLUCZ');
   ```

2. **Zmień `BACKEND_URL` w `script.js`:**
   ```javascript
   let BACKEND_URL = 'http://localhost:3000'; // lub URL Twojego serwera
   ```

3. **Przetestuj na prawdziwej stronie:**
   - Otwórz `index.html` lub `wakacje-dla-ciebie.html`
   - Kliknij przycisk płatności

## Więcej Informacji

- [Dokumentacja Stripe](https://stripe.com/docs)
- [Stripe Dashboard](https://dashboard.stripe.com/)
- [Testowe Karty](https://stripe.com/docs/testing)




