# 🔔 Konfiguracja Webhook Stripe - Automatyczne Emaile

## ❌ Problem: Email z voucherem nie przychodzi

To oznacza, że webhook Stripe nie jest skonfigurowany. Webhook to sposób, w jaki Stripe informuje Twój serwer o zakończonej płatności.

---

## ✅ Rozwiązanie: Skonfiguruj Webhook

### KROK 1: Dodaj Webhook w Stripe Dashboard

1. Przejdź do **Stripe Dashboard**: https://dashboard.stripe.com/
2. Zaloguj się
3. Przejdź do **Developers** → **Webhooks** (w menu po lewej)
4. Kliknij **"Add endpoint"** (lub "Add webhook endpoint")

---

### KROK 2: Wypełnij formularz webhook

1. **Endpoint URL:**
   ```
   https://ganz-neon.vercel.app/api/webhook
   ```
   (Zamień `ganz-neon.vercel.app` na swój URL z Vercel, jeśli jest inny)

2. **Description (opcjonalnie):**
   ```
   Travel Faden - Voucher emails
   ```

3. **Events to send:**
   - Kliknij **"Select events"**
   - Znajdź i zaznacz: **`checkout.session.completed`**
   - Kliknij **"Add events"**

4. Kliknij **"Add endpoint"**

---

### KROK 3: Skopiuj Signing Secret

1. Po utworzeniu webhook zobaczysz stronę szczegółów
2. Znajdź sekcję **"Signing secret"**
3. Kliknij **"Reveal"** lub **"Click to reveal"**
4. Skopiuj secret (zaczyna się od `whsec_...`)
   - ⚠️ **WAŻNE**: Skopiuj go teraz, bo nie będzie widoczny później!

---

### KROK 4: Dodaj Signing Secret do Vercel

1. Przejdź do **Vercel Dashboard**
2. Otwórz swój projekt
3. Przejdź do **Settings** → **Environment Variables**
4. Kliknij **"Create new"**
5. Wypełnij:
   - **Key:** `STRIPE_WEBHOOK_SECRET`
   - **Value:** Wklej skopiowany signing secret (zaczyna się od `whsec_`)
   - **Environment:** Zaznacz **Production** (i opcjonalnie Preview)
6. Kliknij **"Save"**

---

### KROK 5: Redeploy Projekt

Po dodaniu zmiennej środowiskowej:

1. Przejdź do **Deployments**
2. Kliknij **"..."** przy najnowszym deployment
3. Kliknij **"Redeploy"**
4. **ODZNACZ** "Use existing Build Cache"
5. Kliknij **"Redeploy"**
6. Poczekaj, aż deployment się zakończy

---

### KROK 6: Przetestuj

1. Otwórz stronę: `https://ganz-neon.vercel.app`
2. Kliknij "Zahlungspflichtig bestellen"
3. Wykonaj testową płatność:
   - Karta: `4242 4242 4242 4242`
   - Data: `12/26` (lub inna przyszła)
   - CVC: `123`
   - ZIP: `12345`
4. Po udanej płatności sprawdź email — powinien przyjść automatycznie! 🎉

---

## 🔍 Sprawdź czy webhook działa

### W Stripe Dashboard:

1. Przejdź do **Developers** → **Webhooks**
2. Kliknij na swój webhook
3. Przejdź do zakładki **"Logs"**
4. Zobaczysz historię wywołań webhooka
5. Po testowej płatności powinieneś zobaczyć:
   - ✅ Status: `200` (sukces)
   - ✅ Event: `checkout.session.completed`

**Jeśli widzisz błąd:**
- Sprawdź logi w Vercel (poniżej)

---

### W Vercel Dashboard:

1. Przejdź do **Deployments**
2. Kliknij na deployment
3. Kliknij **"Resources"** (lub "Functions")
4. Kliknij na funkcję `api/webhook`
5. Zobaczysz logi w czasie rzeczywistym

**Szukaj:**
- ✅ "Płatność zakończona" - OK!
- ✅ "Email z voucherem wysłany pomyślnie" - OK!
- ❌ "Webhook Error" - problem z signing secret
- ❌ "Resend nie jest skonfigurowany" - brakuje RESEND_API_KEY

---

## ❓ Najczęstsze problemy

### Problem 1: "Webhook Error: No signatures found"

**Rozwiązanie:**
- Sprawdź czy `STRIPE_WEBHOOK_SECRET` jest ustawiony w Vercel
- Sprawdź czy zrobiłeś redeploy po dodaniu zmiennej

### Problem 2: "Webhook Error: Invalid signature"

**Rozwiązanie:**
- Sprawdź czy signing secret jest poprawny (skopiowany z Stripe)
- Sprawdź czy nie ma dodatkowych spacji

### Problem 3: Email nie przychodzi, ale webhook działa

**Rozwiązanie:**
- Sprawdź folder SPAM
- Sprawdź czy `RESEND_API_KEY` jest ustawiony w Vercel
- Sprawdź logi w Vercel → Functions → api/webhook

---

## 📋 Checklist

- [ ] Webhook dodany w Stripe Dashboard
- [ ] Endpoint URL: `https://ganz-neon.vercel.app/api/webhook`
- [ ] Event: `checkout.session.completed` zaznaczony
- [ ] Signing secret skopiowany
- [ ] `STRIPE_WEBHOOK_SECRET` dodany do Vercel
- [ ] Projekt zredeployowany
- [ ] Przetestowana płatność
- [ ] Email z voucherem przyszedł

---

## 🎉 Gotowe!

Po skonfigurowaniu webhooka:
- ✅ Każda płatność automatycznie wyśle email z voucherem
- ✅ Nie musisz nic robić ręcznie
- ✅ Wszystko działa automatycznie!

---

Daj znać, czy email przyszedł po skonfigurowaniu webhooka! 😊
