# 🔧 Naprawa Błędu 500 - Vercel Functions

## ❌ Problem: FUNCTION_INVOCATION_FAILED (500)

Funkcja się uruchomiła, ale wystąpił błąd podczas wykonywania.

---

## 🔍 KROK 1: Sprawdź Logi

1. W Vercel Dashboard → **Deployments**
2. Kliknij na deployment (ten z błędem)
3. Kliknij **"Resources"** (lub "Logs")
4. Kliknij na funkcję, która ma błąd (np. `api/verify-session`)
5. Zobaczysz logi z dokładnym błędem

**Szukaj:**
- "STRIPE_SECRET_KEY is not defined" - brakuje zmiennej środowiskowej
- "Cannot find module" - brakuje pakietu
- "Syntax error" - błąd w kodzie

---

## ✅ Najczęstsze przyczyny i rozwiązania

### Problem 1: Brakuje zmiennych środowiskowych

**Błąd w logach:**
```
STRIPE_SECRET_KEY is not defined
```

**Rozwiązanie:**
1. Vercel Dashboard → **Settings** → **Environment Variables**
2. Sprawdź czy masz:
   - `STRIPE_SECRET_KEY`
   - `RESEND_API_KEY`
   - `FROM_EMAIL`
   - `CONTACT_EMAIL`
3. Jeśli brakuje - dodaj
4. **Redeploy** projekt

---

### Problem 2: Brakuje pakietów Node.js

**Błąd w logach:**
```
Cannot find module 'stripe'
Cannot find module 'resend'
```

**Rozwiązanie:**
1. Sprawdź czy `package.json` jest w GitHub
2. Sprawdź czy zawiera:
   ```json
   {
     "dependencies": {
       "stripe": "^14.0.0",
       "resend": "^3.2.0"
     }
   }
   ```
3. Jeśli brakuje - dodaj do `package.json`
4. Commit i push do GitHub
5. Vercel automatycznie zainstaluje pakiety

---

### Problem 3: Błąd w kodzie funkcji

**Błąd w logach:**
```
SyntaxError: Unexpected token
ReferenceError: X is not defined
```

**Rozwiązanie:**
1. Sprawdź logi - zobaczysz dokładną linię błędu
2. Sprawdź plik funkcji (np. `api/verify-session.js`)
3. Napraw błąd
4. Commit i push
5. Vercel zredeployuje

---

## 🧪 KROK 2: Sprawdź które funkcje działają

Przetestuj każdy endpoint:

1. **verify-session:**
   ```
   https://ganz-neon.vercel.app/api/verify-session?sessionId=test
   ```

2. **create-checkout-session:**
   (Ten wymaga POST, więc przetestuj przez stronę)

3. **send-test-email:**
   (Przetestuj przez konsolę przeglądarki)

**Które działają, a które nie?**

---

## 🔧 KROK 3: Szybka naprawa

### Jeśli błąd dotyczy `STRIPE_SECRET_KEY`:

1. Vercel Dashboard → **Settings** → **Environment Variables**
2. Sprawdź czy `STRIPE_SECRET_KEY` jest ustawione
3. Sprawdź czy wartość jest poprawna (zaczyna się od `sk_test_` lub `sk_live_`)
4. **Redeploy** projekt

### Jeśli błąd dotyczy pakietów:

1. Sprawdź `package.json` w GitHub
2. Upewnij się, że zawiera:
   ```json
   {
     "dependencies": {
       "stripe": "^14.0.0",
       "resend": "^3.2.0"
     }
   }
   ```
3. Jeśli brakuje - dodaj i push do GitHub

---

## 📋 Checklist

- [ ] Sprawdziłem logi w Vercel
- [ ] Sprawdziłem czy wszystkie zmienne środowiskowe są ustawione
- [ ] Sprawdziłem czy `package.json` zawiera potrzebne pakiety
- [ ] Sprawdziłem czy `package.json` jest w GitHub
- [ ] Zrobiłem redeploy po zmianach

---

## 🆘 Co dokładnie widzisz w logach?

Napisz mi:
1. Jaki dokładny błąd jest w logach?
2. Która funkcja ma błąd? (verify-session, create-checkout-session, itp.)
3. Czy wszystkie zmienne środowiskowe są ustawione?

Pomogę naprawić! 😊
