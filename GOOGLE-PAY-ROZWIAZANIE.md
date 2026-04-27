# Dlaczego Google Pay Nie Się Nie Pokazuje?

## Wymagania Google Pay:

1. **HTTPS lub localhost** - Google Pay wymaga bezpiecznego połączenia
   - ✅ Działa na: `https://domena.pl` (produkcja)
   - ✅ Działa na: `http://localhost` (testy lokalne)
   - ❌ NIE działa na: `http://192.168.x.x` (IP bez HTTPS)

2. **Chrome lub Edge** - tylko te przeglądarki obsługują Google Pay

3. **Karta w Google Pay** - musisz mieć kartę dodaną do Google Pay

4. **Włączone w Stripe Dashboard** - Settings → Payment methods → Google Pay

## Rozwiązania:

### Rozwiązanie 1: Użyj HTTPS (Zalecane)

Możesz użyć narzędzia jak **ngrok** do stworzenia tunelu HTTPS:

1. Pobierz ngrok: https://ngrok.com/
2. Uruchom:
   ```bash
   ngrok http 3000
   ```
3. Skopiuj URL (np. `https://abc123.ngrok.io`)
4. Otwórz na telefonie: `https://abc123.ngrok.io/test-stripe.html`

### Rozwiązanie 2: Testuj na localhost (Komputer)

Jeśli testujesz na komputerze, użyj:
```
http://localhost:3000/test-stripe.html
```

Google Pay powinien działać na localhost.

### Rozwiązanie 3: Sprawdź Konfigurację Stripe

1. Zaloguj się do [Stripe Dashboard](https://dashboard.stripe.com/)
2. Przejdź do **Settings → Payment methods**
3. Upewnij się, że **Google Pay** jest włączone
4. Sprawdź, czy domena jest zweryfikowana (dla produkcji)

### Rozwiązanie 4: Sprawdź na Telefonie

- ✅ Używasz Chrome lub Edge?
- ✅ Masz kartę w Google Pay?
- ✅ Czy widzisz inne metody płatności (karty, PayPal)?

## Testowanie:

1. **Na komputerze (localhost):**
   - Otwórz: `http://localhost:3000/test-stripe.html`
   - Google Pay powinien się pojawić w Chrome/Edge

2. **Na telefonie (przez IP):**
   - Google Pay może NIE działać przez HTTP
   - Użyj ngrok dla HTTPS

3. **W produkcji:**
   - Google Pay działa tylko na HTTPS
   - Upewnij się, że masz certyfikat SSL




