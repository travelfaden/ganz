# Nowa oferta – Reisevorschlag des Tages

**Szablon strony szczegółów:** `vorlagen/angebot-vorlage.html`  
**Lista ofert:** `reisevorschlaege.html` (karta na górze listy — wzór w komentarzu HTML)

## Krok 1 – Zdjęcie

Wrzuć do `images/`, np. `images/kreta-2026.png`

## Krok 2 – Strona szczegółów

1. Skopiuj **`vorlagen/angebot-vorlage.html`** → **`angebot-zielort.html`** (w głównym folderze projektu)
2. Zamień placeholdery: ZIELORT, zdjęcie, daty, teksty, `<title>`, ścieżki `../images/` → `images/`, `../styles.css` → `styles.css`, `../script.js` → `script.js`
3. **Reisevorschlag des Tages ID** — blok `.angebot-reise-id`, np. `TF-KRETA-12092026` (format: `TF-MIEJSCE-DDMMYYYY` od daty wylotu; każde ID tylko raz)
4. Link **Jetzt bestellen** → `/reisevorschlag-des-tages?rid=TF-KRETA-12092026` (ten sam ID co w bloku)
5. Dopisz ten sam ID w **`script.js`** (`VALID_REISEVORSCHLAG_IDS`) **oraz** w **`api/_lib/reisevorschlag-ids.js`**
6. **Bestellnummer** (`TF-001`, `TF-002`…) nadaje się automatycznie po płatności — nie ustawiasz ręcznie
7. **Data podróży** — blok `.angebot-travel-date`; zmień daty w `angebot-travel-date-value`
8. W siatce meta (✈️ 🌙 💰 🏨) jest pole **Unterkunftsart** — zmień wartość (np. `Hotel`)
9. Dolny **Hinweis** zostaw bez zmian
10. Dodaj URL do **`sitemap.xml`**

## Krok 3 – Karta na liście

W **`reisevorschlaege.html`**:
1. Usuń lub zastąp blok `.daily-offers-empty`
2. Wklej **na górze** `<div class="daily-offers-list">` nową kartę (wzór w komentarzu HTML w tym pliku)

Link do strony szczegółów, np.:

`href="/angebot-kreta"`

## Krok 4 – Online

```powershell
git add .
git commit -m "Neues Angebot: Kreta"
git push
```

## Podgląd lokalny

- `npm run dev` → http://localhost:3000/reisevorschlaege
- Szablon (noindex): http://localhost:3000/vorlagen/angebot-vorlage

## Usuwanie starej oferty

1. Usuń kartę z `reisevorschlaege.html`
2. Usuń plik `angebot-….html`
3. Usuń ID z `script.js` i `api/_lib/reisevorschlag-ids.js`
4. Usuń wpis z `sitemap.xml` (opcjonalnie redirect w `vercel.json`)
