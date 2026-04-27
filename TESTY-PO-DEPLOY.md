# ✅ Testy po Deploy na Vercel

## 🎯 Co teraz?

Po dodaniu zmiennych środowiskowych i redeploy, sprawdźmy czy wszystko działa!

---

## 📋 KROK 1: Sprawdź URL Twojego Projektu

1. W Vercel Dashboard → **Settings** → **General**
2. Znajdź sekcję **"Domains"**
3. Zobaczysz URL typu: `twoja-strona.vercel.app`
4. **Zapisz ten URL** - będziesz go potrzebować!

---

## 🧪 KROK 2: Przetestuj Endpointy

### Test 1: Sprawdź czy endpoint działa

Otwórz w przeglądarce (zamień na swój URL):
```
https://twoja-strona.vercel.app/api/verify-session?sessionId=test
```

**Co powinieneś zobaczyć:**
- Błąd JSON (to OK! - oznacza że endpoint działa)
- Albo odpowiedź z informacją o sesji

**Jeśli widzisz błąd 404:**
- Sprawdź czy folder `/api` jest w repozytorium GitHub
- Sprawdź czy zrobiłeś commit i push

---

## 📧 KROK 3: Przetestuj Wysyłanie Emaila

### Test przez przeglądarkę (najprostsze):

1. Otwórz **Narzędzia deweloperskie** (F12)
2. Przejdź do zakładki **Console**
3. Wklej ten kod:

```javascript
fetch('https://twoja-strona.vercel.app/api/send-test-email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    to: 'twoj-email@gmail.com', // ZMIEŃ NA SWÓJ EMAIL!
    subject: 'Test z Vercel',
    message: 'To jest test!'
  })
})
.then(res => res.json())
.then(data => console.log('Wynik:', data))
.catch(err => console.error('Błąd:', err));
```

4. Naciśnij Enter
5. Sprawdź czy email przyszedł!

**LUB użyj narzędzia online:**
- https://reqbin.com/
- Wklej URL: `https://twoja-strona.vercel.app/api/send-test-email`
- Method: POST
- Body (JSON):
```json
{
  "to": "twoj-email@gmail.com",
  "subject": "Test",
  "message": "Test z Vercel!"
}
```

---

## 💳 KROK 4: Przetestuj Płatność Stripe

1. Otwórz swoją stronę na Vercel (np. `https://twoja-strona.vercel.app`)
2. Kliknij **"Kup Usługę"**
3. Wykonaj testową płatność:
   - Karta: `4242 4242 4242 4242`
   - Data: dowolna przyszła data (np. `12/25`)
   - CVC: dowolne 3 cyfry (np. `123`)
   - ZIP: dowolny kod (np. `12345`)
4. Po udanej płatności sprawdź czy email z voucherem przyszedł! 🎉

---

## 📊 KROK 5: Sprawdź Logi

Jeśli coś nie działa, sprawdź logi:

1. Vercel Dashboard → **Deployments**
2. Kliknij na najnowszy deployment
3. Kliknij **"Functions"**
4. Zobaczysz listę funkcji z folderu `/api`
5. Kliknij na funkcję (np. `api/webhook`)
6. Zobaczysz logi w czasie rzeczywistym

**Co szukać w logach:**
- ✅ "Email wysłany" - wszystko OK
- ❌ "Resend nie jest skonfigurowany" - brakuje `RESEND_API_KEY`
- ❌ "Brak klucza Stripe" - brakuje `STRIPE_SECRET_KEY`

---

## 🔔 KROK 6: Skonfiguruj Webhook Stripe (Opcjonalnie)

Jeśli chcesz, żeby emaile z voucherami wysyłały się automatycznie po płatności:

1. Przejdź do **Stripe Dashboard** → **Developers** → **Webhooks**
2. Kliknij **"Add endpoint"**
3. **Endpoint URL:** `https://twoja-strona.vercel.app/api/webhook`
   (zamień `twoja-strona.vercel.app` na swój URL!)
4. Wybierz event: **`checkout.session.completed`**
5. Kliknij **"Add endpoint"**
6. Skopiuj **Signing secret** (zaczyna się od `whsec_`)
7. Wróć do Vercel → **Settings** → **Environment Variables**
8. Dodaj:
   - **Key:** `STRIPE_WEBHOOK_SECRET`
   - **Value:** Skopiowany signing secret
   - **Environment:** Production
9. **Redeploy** projekt

---

## ✅ Checklist - Co powinno działać:

- [ ] Endpoint `/api/verify-session` odpowiada (nawet z błędem)
- [ ] Endpoint `/api/send-test-email` wysyła email
- [ ] Płatność Stripe działa
- [ ] Email z voucherem przychodzi po płatności (jeśli webhook skonfigurowany)
- [ ] Logi w Vercel pokazują działanie funkcji

---

## ❓ Co jeśli coś nie działa?

### Problem: "Function not found" / 404
**Rozwiązanie:**
- Sprawdź czy folder `/api` jest w GitHub
- Zrób commit i push
- Vercel automatycznie wykryje funkcje

### Problem: "Environment variable not found"
**Rozwiązanie:**
- Sprawdź czy wszystkie zmienne są dodane w Vercel
- Sprawdź czy zrobiłeś redeploy po dodaniu zmiennych

### Problem: Email nie przychodzi
**Rozwiązanie:**
- Sprawdź folder SPAM
- Sprawdź logi w Vercel → Functions → Logs
- Sprawdź czy `RESEND_API_KEY` jest poprawny
- Sprawdź czy `FROM_EMAIL` jest ustawiony

### Problem: CORS error
**Rozwiązanie:**
- Wszystkie funkcje mają już skonfigurowane CORS
- Sprawdź czy używasz poprawnego URL (z `https://`)

---

## 🎉 Gotowe!

Jeśli wszystkie testy przeszły pomyślnie:
- ✅ Twoja strona działa na Vercel
- ✅ API endpointy działają
- ✅ Emails wysyłają się
- ✅ Płatności Stripe działają

**Nie musisz już uruchamiać serwera lokalnie!** 🚀

---

## 📞 Potrzebujesz pomocy?

Jeśli coś nie działa:
1. Sprawdź logi w Vercel Dashboard
2. Sprawdź czy wszystkie zmienne są dodane
3. Napisz mi, co dokładnie nie działa!
