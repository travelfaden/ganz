# Instrukcja Instalacji Node.js i npm

## Krok 1: Zainstaluj Node.js

1. **Pobierz Node.js:**
   - Przejdź na stronę: https://nodejs.org/
   - Pobierz wersję **LTS** (Long Term Support) - zalecana
   - Wybierz wersję dla Windows (64-bit)

2. **Zainstaluj Node.js:**
   - Uruchom pobrany instalator (np. `node-v20.x.x-x64.msi`)
   - Kliknij "Next" przez wszystkie kroki
   - **WAŻNE:** Zaznacz opcję "Add to PATH" jeśli jest dostępna
   - Zakończ instalację

3. **Zamknij i otwórz ponownie terminal:**
   - Zamknij PowerShell/CMD
   - Otwórz nowy terminal
   - To jest ważne, aby system rozpoznał nowe ścieżki

## Krok 2: Sprawdź Instalację

Otwórz PowerShell lub CMD i wpisz:

```bash
node --version
npm --version
```

Powinieneś zobaczyć numery wersji, np.:
```
v20.10.0
10.2.3
```

## Krok 3: Zainstaluj Zależności

Gdy Node.js jest zainstalowany, przejdź do katalogu z projektem:

```bash
cd C:\Users\uciek\website
```

Następnie uruchom:

```bash
npm install
```

To zainstaluje wszystkie potrzebne pakiety:
- `express` - serwer HTTP
- `stripe` - biblioteka Stripe
- `cors` - obsługa CORS
- `dotenv` - zmienne środowiskowe

## Krok 4: Utwórz Plik .env

Utwórz plik `.env` w katalogu `C:\Users\uciek\website` z zawartością:

```
STRIPE_SECRET_KEY=sk_test_TWOJ_KLUCZ_TUTAJ
PORT=3000
```

**Gdzie znaleźć klucz Stripe:**
1. Zaloguj się do https://dashboard.stripe.com/
2. Przejdź do **Developers → API keys**
3. Skopiuj **Secret key** (zaczyna się od `sk_test_`)

## Krok 5: Uruchom Backend

```bash
npm start
```

lub

```bash
node backend-example.js
```

Powinieneś zobaczyć:
```
Serwer działa na porcie 3000
Stripe endpoint: http://localhost:3000/api/create-checkout-session
```

## Rozwiązywanie Problemów

### Problem: "npm nie jest rozpoznany"
- **Rozwiązanie:** Zamknij i otwórz ponownie terminal
- Jeśli nadal nie działa, zrestartuj komputer
- Sprawdź, czy Node.js został zainstalowany: przejdź do "Dodaj lub usuń programy" i szukaj "Node.js"

### Problem: "EACCES" lub błędy uprawnień
- **Rozwiązanie:** Uruchom PowerShell jako Administrator (prawy przycisk → "Uruchom jako administrator")

### Problem: Błąd podczas `npm install`
- **Rozwiązanie:** Spróbuj:
  ```bash
  npm cache clean --force
  npm install
  ```

## Alternatywa: Użyj Yarn

Jeśli npm nie działa, możesz użyć Yarn:

1. Zainstaluj Yarn: https://yarnpkg.com/getting-started/install
2. Uruchom: `yarn install`

## Więcej Informacji

- Dokumentacja Node.js: https://nodejs.org/docs/
- Dokumentacja npm: https://docs.npmjs.com/
- Stripe Node.js SDK: https://stripe.com/docs/api/node




