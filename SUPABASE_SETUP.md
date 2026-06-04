# Supabase – konfiguracja (Travel Faden)

## Krok 1: Tabela w Supabase

1. Otwórz [Supabase Dashboard](https://supabase.com/dashboard) → swój projekt.
2. **SQL Editor** → **New query**.
3. Skopiuj całą zawartość pliku `supabase/schema.sql` i kliknij **Run**.
4. **Table Editor** → powinna pojawić się tabela `order_consents`.

## Krok 2: Klucze API

1. **Project Settings** → **API**.
2. Skopiuj:
   - **Project URL** → `SUPABASE_URL`
   - **service_role** (secret) → `SUPABASE_SERVICE_ROLE_KEY`  
     ⚠️ Nigdy nie wklejaj `service_role` do kodu strony (script.js) – tylko Vercel.

## Krok 3: Zmienne w Vercel

Vercel → projekt → **Settings** → **Environment Variables** → dodaj:

| Nazwa | Wartość |
|--------|---------|
| `SUPABASE_URL` | z Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role z Supabase |

Zaznacz: Production, Preview, Development.

## Krok 4: Wdrożenie kodu

```bash
git add .
git commit -m "Zapis zgód zamówienia w Supabase"
git push
```

Vercel zbuduje projekt automatycznie.

## Krok 5: Test

1. Otwórz stronę usługi (np. `oferta-dnia.html`).
2. Zaznacz checkboxy → **Jetzt kostenpflichtig bestellen**.
3. W Supabase → **Table Editor** → `order_consents` → nowy wiersz (`payment_status`: `pending`).
4. Dokończ testową płatność Stripe.
5. Po webhooku wiersz powinien mieć `paid`, `stripe_session_id`, `customer_email`.

## Co jest zapisywane

- `consent_id` – ID zgody (np. `TF-CONSENT-…`)
- `created_at` – czas zapisu
- `ip_address`, `user_agent`
- `consents` – JSON z treścią i statusem checkboxów
- po płatności: `stripe_session_id`, `customer_email`, `voucher_number`
