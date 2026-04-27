# Rozwiązywanie Problemów z Localhost

## Backend działa, ale localhost nie otwiera się w przeglądarce?

### Sprawdź:

1. **Czy używasz właściwego adresu?**
   - ✅ DOBRZE: `http://localhost:3000/test-stripe.html`
   - ✅ DOBRZE: `http://127.0.0.1:3000/test-stripe.html`
   - ❌ ŹLE: `file:///C:/Users/uciek/website/test-stripe.html` (nie zadziała z backendem)

2. **Czy backend jest uruchomiony?**
   ```powershell
   Get-Process -Name node
   ```
   Jeśli nie ma procesu node, uruchom:
   ```powershell
   $env:PATH += ";C:\Program Files\nodejs"
   node backend-example.js
   ```

3. **Czy port 3000 jest wolny?**
   ```powershell
   netstat -ano | findstr :3000
   ```
   Jeśli port jest zajęty, zmień PORT w pliku `.env`

4. **Czy firewall blokuje połączenie?**
   - Sprawdź ustawienia Windows Firewall
   - Możesz tymczasowo wyłączyć firewall do testów

5. **Spróbuj alternatywnych adresów:**
   - `http://localhost:3000`
   - `http://127.0.0.1:3000`
   - `http://0.0.0.0:3000`

## Rozwiązania:

### Rozwiązanie 1: Sprawdź czy backend działa
```powershell
# W PowerShell
$env:PATH += ";C:\Program Files\nodejs"
Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing
```

### Rozwiązanie 2: Zrestartuj backend
```powershell
# Zatrzymaj wszystkie procesy node
Get-Process -Name node | Stop-Process -Force

# Uruchom ponownie
$env:PATH += ";C:\Program Files\nodejs"
cd C:\Users\uciek\website
node backend-example.js
```

### Rozwiązanie 3: Zmień port
Jeśli port 3000 jest zajęty, zmień w pliku `.env`:
```
PORT=3001
```

I zaktualizuj URL w `test-stripe.html`:
```javascript
const backendUrl = 'http://localhost:3001';
```

### Rozwiązanie 4: Sprawdź przeglądarkę
- Wyczyść cache przeglądarki (Ctrl+Shift+Delete)
- Spróbuj w trybie incognito
- Spróbuj innej przeglądarki (Chrome, Firefox, Edge)

### Rozwiązanie 5: Sprawdź konsolę przeglądarki
1. Otwórz DevTools (F12)
2. Przejdź do zakładki "Console"
3. Sprawdź czy są błędy

## Sprawdzenie czy wszystko działa:

```powershell
# 1. Sprawdź czy backend działa
$env:PATH += ";C:\Program Files\nodejs"
Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing

# 2. Sprawdź czy strona jest dostępna
Invoke-WebRequest -Uri "http://localhost:3000/test-stripe.html" -UseBasicParsing

# 3. Sprawdź endpoint API
$body = '{"amount":80,"currency":"eur","productName":"Test"}'
Invoke-WebRequest -Uri "http://localhost:3000/api/create-checkout-session" -Method POST -ContentType "application/json" -Body $body -UseBasicParsing
```

## Jeśli nadal nie działa:

1. Sprawdź logi backendu w terminalu
2. Sprawdź czy plik `.env` istnieje i ma poprawny klucz Stripe
3. Sprawdź czy Node.js jest w PATH
4. Spróbuj uruchomić backend w nowym terminalu




