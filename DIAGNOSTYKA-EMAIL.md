# 🔍 Diagnostyka: Email z voucherem nie przychodzi

## ❌ Problem: Email nie przyszedł po płatności

Sprawdźmy krok po kroku, co może być nie tak.

---

## 🔍 KROK 1: Sprawdź logi w Stripe Dashboard

1. Przejdź do **Stripe Dashboard** → **Developers** → **Webhooks**
2. Kliknij na swój webhook
3. Przejdź do zakładki **"Logs"**
4. Sprawdź najnowsze wpisy

**Co szukać:**
- ✅ Status: `200` - webhook działa
- ❌ Status: `400`, `401`, `500` - jest problem
- ✅ Event: `checkout.session.completed` - event został wysłany

**Jeśli widzisz błąd:**
- Skopiuj dokładny błąd i napisz mi

---

## 🔍 KROK 2: Sprawdź logi w Vercel

1. **Vercel Dashboard** → **Deployments**
2. Kliknij na najnowszy deployment
3. Kliknij **"Resources"** (lub "Functions")
4. Kliknij na funkcję `api/webhook`
5. Zobaczysz logi w czasie rzeczywistym

**Co szukać:**
- ✅ "Płatność zakończona" - webhook został wywołany
- ✅ "Email z voucherem wysłany pomyślnie" - email został wysłany
- ❌ "Webhook Error" - problem z signing secret
- ❌ "Resend nie jest skonfigurowany" - brakuje RESEND_API_KEY
- ❌ "Cannot find module" - brakuje pakietów

**Jeśli widzisz błąd:**
- Skopiuj dokładny błąd i napisz mi

---

## 🔍 KROK 3: Sprawdź zmienne środowiskowe

1. **Vercel Dashboard** → **Settings** → **Environment Variables**
2. Sprawdź czy masz wszystkie zmienne:
   - ✅ `STRIPE_SECRET_KEY`
   - ✅ `STRIPE_WEBHOOK_SECRET`
   - ✅ `RESEND_API_KEY`
   - ✅ `FROM_EMAIL`
   - ✅ `CONTACT_EMAIL`

**Jeśli brakuje którejś:**
- Dodaj ją i zredeploy projekt

---

## 🔍 KROK 4: Sprawdź czy webhook jest połączony z projektem

1. **Vercel Dashboard** → **Settings** → **Environment Variables**
2. Kliknij na `STRIPE_WEBHOOK_SECRET`
3. Sprawdź sekcję **"Link To Projects"**
4. Upewnij się, że Twój projekt (ganz) jest zaznaczony

**Jeśli nie jest:**
- Zaznacz projekt i zapisz

---

## 🔍 KROK 5: Przetestuj webhook ręcznie

Możesz przetestować, czy webhook działa, wysyłając testowe wydarzenie:

1. **Stripe Dashboard** → **Developers** → **Webhooks**
2. Kliknij na swój webhook
3. Kliknij **"Send test webhook"** (lub podobny przycisk)
4. Wybierz event: `checkout.session.completed`
5. Kliknij **"Send test webhook"**
6. Sprawdź logi w Vercel → Functions → api/webhook

---

## ❓ Najczęstsze problemy

### Problem 1: Webhook nie jest wywoływany

**Objawy:**
- W Stripe Dashboard → Webhooks → Logs nie ma wpisów
- W Vercel → Functions → api/webhook nie ma logów

**Rozwiązanie:**
- Sprawdź czy webhook jest aktywny w Stripe
- Sprawdź czy endpoint URL jest poprawny: `https://ganz-neon.vercel.app/api/webhook`

---

### Problem 2: Webhook Error - Invalid signature

**Objawy:**
- W logach Vercel widzisz: "Webhook Error: Invalid signature"

**Rozwiązanie:**
- Sprawdź czy `STRIPE_WEBHOOK_SECRET` jest poprawny
- Sprawdź czy zrobiłeś redeploy po dodaniu zmiennej
- Sprawdź czy signing secret jest skopiowany bez dodatkowych spacji

---

### Problem 3: Resend nie jest skonfigurowany

**Objawy:**
- W logach Vercel widzisz: "Resend nie jest skonfigurowany"

**Rozwiązanie:**
- Sprawdź czy `RESEND_API_KEY` jest ustawiony w Vercel
- Sprawdź czy klucz jest poprawny (zaczyna się od `re_`)

---

### Problem 4: Email przychodzi do SPAM

**Objawy:**
- Webhook działa, ale email nie przychodzi

**Rozwiązanie:**
- Sprawdź folder SPAM
- Sprawdź czy `FROM_EMAIL` jest ustawiony poprawnie

---

## 📋 Checklist diagnostyczna

- [ ] Sprawdziłem logi w Stripe Dashboard → Webhooks → Logs
- [ ] Sprawdziłem logi w Vercel → Functions → api/webhook
- [ ] Sprawdziłem czy wszystkie zmienne środowiskowe są ustawione
- [ ] Sprawdziłem czy webhook jest połączony z projektem
- [ ] Sprawdziłem folder SPAM
- [ ] Przetestowałem webhook ręcznie

---

## 🆘 Co dokładnie widzisz?

Napisz mi:
1. Co widzisz w logach Stripe Dashboard → Webhooks → Logs?
2. Co widzisz w logach Vercel → Functions → api/webhook?
3. Czy wszystkie zmienne środowiskowe są ustawione?
4. Czy webhook jest połączony z projektem?

Pomogę naprawić! 😊
