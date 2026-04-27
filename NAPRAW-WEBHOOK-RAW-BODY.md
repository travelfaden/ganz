# 🔧 Naprawa: Webhook Error - No signatures found

## ❌ Problem

Błąd: "No signatures found matching the expected signature for payload"

To oznacza, że Vercel parsuje body jako JSON, ale Stripe wymaga raw body do weryfikacji podpisu.

---

## ✅ Rozwiązanie

Vercel automatycznie parsuje body jako JSON dla funkcji serverless. Dla webhooków Stripe musimy użyć specjalnej konfiguracji.

**Problem:** Vercel nie przekazuje raw body domyślnie.

**Rozwiązanie:** Musimy użyć innego podejścia - zamiast weryfikować podpis, możemy użyć `STRIPE_WEBHOOK_SECRET` tylko do weryfikacji, ale musimy mieć raw body.

---

## 🔧 Opcja 1: Użyj `req.body` jako stringa (jeśli Vercel go tak przekazuje)

Zaktualizowałem kod w `api/webhook.js` - sprawdza różne formaty body.

---

## 🔧 Opcja 2: Wyłącz weryfikację podpisu (tylko dla testów)

Możemy tymczasowo wyłączyć weryfikację podpisu, żeby sprawdzić czy reszta działa.

---

## 🔧 Opcja 3: Użyj Stripe CLI do testów lokalnych

Możesz użyć Stripe CLI do testowania webhooków lokalnie, a potem przenieść na Vercel.

---

## 📋 Co zrobić teraz

1. **Commit i push** zaktualizowanego `api/webhook.js`
2. **Redeploy** projekt w Vercel
3. **Przetestuj** ponownie płatność
4. **Sprawdź logi** - powinny pokazać więcej informacji o formacie body

---

## 🆘 Jeśli nadal nie działa

Możemy:
1. Tymczasowo wyłączyć weryfikację podpisu (tylko dla testów)
2. Użyć innego podejścia do obsługi webhooków
3. Sprawdzić dokumentację Vercel dla webhooków Stripe

---

Daj znać, czy po redeploy widzisz inne logi! 😊
