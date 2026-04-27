# 🔧 Naprawa: Przycisk "Zahlungspflichtig bestellen" nie działa

## ❌ Problem

Po kliknięciu w "Zahlungspflichtig bestellen" nic się nie dzieje.

---

## 🔍 Diagnostyka

### KROK 1: Sprawdź błędy w konsoli

1. Otwórz stronę: `https://ganz-neon.vercel.app`
2. Otwórz konsolę przeglądarki (F12)
3. Kliknij zakładkę **"Console"**
4. Kliknij przycisk "Zahlungspflichtig bestellen"
5. Sprawdź czy są błędy w konsoli

**Szukaj:**
- "YOUR_PUBLISHABLE_KEY" - klucz Stripe nie jest ustawiony
- "stripe is not defined" - Stripe nie jest zainicjalizowany
- "Failed to fetch" - problem z połączeniem do API
- Inne błędy

---

## ✅ Rozwiązania

### Problem 1: Klucz Stripe nie jest ustawiony

**Błąd w konsoli:**
```
Invalid API Key provided
```

**Rozwiązanie:**
1. Przejdź do **Stripe Dashboard** → **Developers** → **API keys**
2. Skopiuj **Publishable key** (zaczyna się od `pk_test_` lub `pk_live_`)
3. Otwórz plik `script.js`
4. Znajdź linię 102:
   ```javascript
   stripe = Stripe('YOUR_PUBLISHABLE_KEY');
   ```
5. Zamień `YOUR_PUBLISHABLE_KEY` na swój klucz:
   ```javascript
   stripe = Stripe('pk_test_51AbC123...'); // Twój klucz
   ```
6. Commit i push do GitHub
7. Vercel automatycznie zredeployuje

---

### Problem 2: Przycisk jest disabled

**Sprawdź:**
- Czy przycisk jest szary i nieaktywny?
- Czy checkboxy (AGB, Widerruf) są zaznaczone?

**Rozwiązanie:**
- Zaznacz checkboxy AGB i Widerruf
- Przycisk powinien się aktywować

---

### Problem 3: Błąd połączenia z API

**Błąd w konsoli:**
```
Failed to fetch
CORS error
```

**Rozwiązanie:**
- Sprawdź czy `BACKEND_URL` jest poprawny
- W `script.js` powinno być automatyczne wykrywanie URL
- Sprawdź czy endpoint działa: `https://ganz-neon.vercel.app/api/verify-session?sessionId=test`

---

## 🧪 Test

Po naprawie:

1. Otwórz stronę
2. Otwórz konsolę (F12)
3. Kliknij "Zahlungspflichtig bestellen"
4. Sprawdź czy:
   - Nie ma błędów w konsoli
   - Przycisk zmienia się na "Przetwarzanie..."
   - Przekierowuje do Stripe Checkout

---

## 📋 Checklist

- [ ] Sprawdziłem błędy w konsoli przeglądarki
- [ ] Ustawiłem klucz Stripe w `script.js`
- [ ] Zaznaczyłem checkboxy AGB i Widerruf
- [ ] Zrobiłem commit i push zmian
- [ ] Vercel zredeployował projekt
- [ ] Przetestowałem ponownie

---

## 🆘 Co dokładnie widzisz?

Napisz mi:
1. Jaki błąd jest w konsoli? (F12 → Console)
2. Czy przycisk jest aktywny (nie szary)?
3. Czy checkboxy są zaznaczone?

Pomogę naprawić! 😊
