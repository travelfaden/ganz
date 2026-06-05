# Nowa oferta – Reisevorschlag des Tages

**Szablon strony:** `angebot-mallorca.html`  
**Lista:** `oferta-dnia-nav.html` (karta na górze listy)

## Krok 1 – Zdjęcie

Wrzuć do `images/`, np. `images/kreta-2026.png`

## Krok 2 – Strona szczegółów

1. Skopiuj **`angebot-mallorca.html`** → **`angebot-kreta.html`**
2. Zamień (Ctrl+H): Mallorca → Kreta, zdjęcie, daty, teksty, `<title>`
3. **Reisevorschlag-ID** — nad datą podróży blok `.angebot-reise-id`, np. `TF-KRETA-12092026` (format: `TF-NAZWA-DDMMYYYY` od daty wyjazdu)
4. Link **Jetzt bestellen** → `oferta-dnia.html?rid=TF-KRETA-12092026` (ten sam ID co w bloku)
5. W **`script.js`** w obiekcie `VALID_REISEVORSCHLAG_IDS` dopisz nowy wpis z tym samym ID
6. **Data podróży** — blok `.angebot-travel-date` nad siatką; zmień daty w `angebot-travel-date-value`
7. W siatce meta (✈️ 🌙 💰 🏡) jest stałe pole **Unterkunftsart** — zmień wartość (np. `Hotel`)
8. Dolny **Wichtiger Hinweis** zostaw bez zmian

## Krok 3 – Karta na liście

W **`oferta-dnia-nav.html`** wklej **na górze** `<div class="daily-offers-list">` nową kartę (wzór: Mallorca). **Data** w bloku `daily-offer-travel-date` (duża, na środku). Link:

`href="angebot-kreta.html"`

## Krok 4 – Online

```powershell
git add .
git commit -m "Neues Angebot: Kreta"
git push
```

## Podgląd

- Otwórz plik HTML w przeglądarce (widzisz treść od razu w pliku)
- Lub: `npm run preview` → http://localhost:3000/oferta-dnia-nav.html
