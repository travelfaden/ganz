# ✅ Konfiguracja Vercel - Krok po Kroku

## 🎯 Sytuacja
- ✅ Masz stronę na GitHub
- ✅ GitHub połączony z Vercel
- ✅ Folder `/api` z funkcjami serverless jest gotowy
- ⚠️ **Teraz musisz tylko dodać zmienne środowiskowe!**

---

## 📝 KROK 1: Wejdź do Vercel Dashboard

1. Przejdź na **https://vercel.com/dashboard**
2. Zaloguj się
3. Znajdź swój projekt **Travel Faden**
4. Kliknij na nazwę projektu

---

## ⚙️ KROK 2: Dodaj Zmienne Środowiskowe

1. W projekcie kliknij **"Settings"** (Ustawienia)
2. W menu po lewej kliknij **"Environment Variables"** (Zmienne środowiskowe)
3. Dodaj każdą zmienną osobno:

### Zmienna 1: STRIPE_SECRET_KEY
- **Name:** `STRIPE_SECRET_KEY`
- **Value:** Twój klucz Stripe (zaczyna się od `sk_test_` lub `sk_live_`)
- **Environment:** Zaznacz wszystkie (Production, Preview, Development)
- Kliknij **"Save"**

### Zmienna 2: STRIPE_WEBHOOK_SECRET
- **Name:** `STRIPE_WEBHOOK_SECRET`
- **Value:** (Na razie możesz pominąć, dodamy później)
- **Environment:** Production
- Kliknij **"Save"**

### Zmienna 3: RESEND_API_KEY
- **Name:** `RESEND_API_KEY`
- **Value:** Twój klucz z Resend (zaczyna się od `re_`)
- **Environment:** Zaznacz wszystkie
- Kliknij **"Save"**

### Zmienna 4: FROM_EMAIL
- **Name:** `FROM_EMAIL`
- **Value:** `onboarding@resend.dev` (dla testów) lub `noreply@twoja-domena.pl`
- **Environment:** Zaznacz wszystkie
- Kliknij **"Save"**

### Zmienna 5: CONTACT_EMAIL
- **Name:** `CONTACT_EMAIL`
- **Value:** Twój email (np. `twoj-email@gmail.com`)
- **Environment:** Zaznacz wszystkie
- Kliknij **"Save"**

---

## 🔄 KROK 3: Redeploy Projektu

Po dodaniu zmiennych środowiskowych:

1. Przejdź do zakładki **"Deployments"**
2. Znajdź najnowszy deployment
3. Kliknij **"..."** (trzy kropki) obok deploymentu
4. Kliknij **"Redeploy"**
5. Zaznacz **"Use existing Build Cache"** (opcjonalnie)
6. Kliknij **"Redeploy"**

**LUB** po prostu:
- Zrób małą zmianę w kodzie (np. dodaj spację w `index.html`)
- Zcommit i push do GitHub
- Vercel automatycznie zredeployuje

---

## 🔗 KROK 4: Sprawdź URL Twojego Projektu

1. W Vercel Dashboard, w zakładce **"Settings" → "General"**
2. Znajdź **"Domains"**
3. Zobaczysz URL typu: `twoja-strona.vercel.app`
4. **Zapisz ten URL** - będziesz go potrzebować!

---

## 🧪 KROK 5: Przetestuj Endpointy

### Test 1: Sprawdź czy endpoint działa

Otwórz w przeglądarce:
```
https://twoja-strona.vercel.app/api/verify-session?sessionId=test
```

Powinieneś zobaczyć odpowiedź JSON (błąd jest OK, to tylko test połączenia).

### Test 2: Sprawdź logi

1. W Vercel Dashboard → **"Deployments"**
2. Kliknij na najnowszy deployment
3. Kliknij **"Functions"**
4. Zobaczysz listę funkcji z folderu `/api`
5. Kliknij na którąś funkcję, żeby zobaczyć logi

---

## 🔔 KROK 6: Skonfiguruj Webhook Stripe (Opcjonalnie)

Jeśli chcesz, żeby emaile z voucherami wysyłały się automatycznie:

1. Przejdź do **Stripe Dashboard** → **Developers** → **Webhooks**
2. Kliknij **"Add endpoint"**
3. **Endpoint URL:** `https://twoja-strona.vercel.app/api/webhook`
4. Wybierz event: **`checkout.session.completed`**
5. Kliknij **"Add endpoint"**
6. Skopiuj **Signing secret** (zaczyna się od `whsec_`)
7. Wróć do Vercel → **Settings** → **Environment Variables**
8. Dodaj:
   - **Name:** `STRIPE_WEBHOOK_SECRET`
   - **Value:** Skopiowany signing secret
   - **Environment:** Production
9. **Redeploy** projekt

---

## ✅ KROK 7: Sprawdź czy wszystko działa

### Test pełnej płatności:

1. Otwórz swoją stronę na Vercel
2. Kliknij "Kup Usługę"
3. Wykonaj testową płatność (karta: `4242 4242 4242 4242`)
4. Sprawdź czy email z voucherem przyszedł! 🎉

---

## ❓ Najczęstsze Problemy

### Problem: "Function not found"
**Rozwiązanie:** 
- Sprawdź czy folder `/api` jest w repozytorium GitHub
- Zrób commit i push zmian
- Vercel automatycznie wykryje funkcje

### Problem: "Environment variable not found"
**Rozwiązanie:**
- Sprawdź czy dodałeś zmienne w Vercel Dashboard
- Upewnij się, że zrobiłeś redeploy po dodaniu zmiennych

### Problem: "CORS error"
**Rozwiązanie:**
- Wszystkie funkcje mają już skonfigurowane CORS
- Sprawdź czy używasz poprawnego URL (z `https://`)

### Problem: Email nie przychodzi
**Rozwiązanie:**
- Sprawdź folder SPAM
- Sprawdź logi w Vercel Dashboard → Functions → Logs
- Upewnij się, że `RESEND_API_KEY` jest poprawny

---

## 📊 Gdzie sprawdzić logi?

1. **Vercel Dashboard** → Twój projekt → **"Deployments"**
2. Kliknij na deployment → **"Functions"**
3. Kliknij na funkcję (np. `api/webhook`)
4. Zobaczysz logi w czasie rzeczywistym

---

## 🎉 Gotowe!

Jeśli wszystko skonfigurowałeś:
- ✅ Zmienne środowiskowe dodane
- ✅ Projekt zredeployowany
- ✅ Endpointy działają
- ✅ Webhook skonfigurowany (opcjonalnie)

**Twoja strona działa na Vercel bez potrzeby uruchamiania serwera!** 🚀

---

## 📞 Potrzebujesz pomocy?

Jeśli coś nie działa:
1. Sprawdź logi w Vercel Dashboard
2. Sprawdź czy wszystkie zmienne są dodane
3. Sprawdź czy zrobiłeś redeploy
4. Napisz mi, co dokładnie nie działa!
