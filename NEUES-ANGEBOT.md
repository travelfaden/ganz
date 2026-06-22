# Nowa oferta – Reisevorschlag des Tages

**Szablon strony:** `angebot-mallorca.html`  
**Lista:** `reisevorschlaege.html` (karta na górze listy)

## Krok 1 – Zdjęcie

Wrzuć do `images/`, np. `images/kreta-2026.png`

## Krok 2 – Strona szczegółów

1. Skopiuj **`angebot-mallorca.html`** → **`angebot-kreta.html`**
2. Zamień (Ctrl+H): Mallorca → Kreta, zdjęcie, daty, teksty, `<title>`
3. **Reisevorschlag des Tages ID** — nad datą podróży blok `.angebot-reise-id`, np. `TF-KRETA-12092026` (format: `TF-MIEJSCE-DDMMYYYY` od daty wylotu; każde ID tylko raz w całej ofercie)
4. Link **Jetzt bestellen** → `/reisevorschlag-des-tages?rid=TF-KRETA-12092026` (ten sam ID co w bloku)
5. Dopisz ten sam ID w **`script.js`** (`VALID_REISEVORSCHLAG_IDS`) **oraz** w **`api/_lib/reisevorschlag-ids.js`**
6. **Bestellnummer** (`TF-001`, `TF-002`…) nadaje się automatycznie po płatności — nie ustawiasz ręcznie
7. **Data podróży** — blok `.angebot-travel-date` nad siatką; zmień daty w `angebot-travel-date-value`
8. W siatce meta (✈️ 🌙 💰 🏡) jest stałe pole **Unterkunftsart** — zmień wartość (np. `Hotel`)
9. Dolny **Wichtiger Hinweis** zostaw bez zmian

## Krok 3 – Karta na liście

W **`reisevorschlaege.html`** wklej **na górze** `<div class="daily-offers-list">` nową kartę (wzór: Mallorca). **Data** w bloku `daily-offer-travel-date` (duża, na środku). Link:

`href="/angebot-kreta"`

## Krok 4 – Online

```powershell
git add .
git commit -m "Neues Angebot: Kreta"
git push
```

## Podgląd

- Otwórz plik HTML w przeglądarce (widzisz treść od razu w pliku)
- Lub: `npm run dev` → http://localhost:3000/reisevorschlaege
