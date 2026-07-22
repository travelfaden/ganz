# Nowa oferta – Reisevorschlag des Tages

**Wzorzec produkcyjny:** `angebot-warschau.html` (kopiuj i dostosuj)  
**Stary szablon placeholder:** `vorlagen/angebot-vorlage.html`  
**Lista ofert:** `reisevorschlaege.html` (nowa karta zawsze na górze listy)

## Krok 1 – Zdjęcie

Wrzuć do `images/`, np. `images/kreta-2026.png` (hero + miniatura listy)

## Krok 2 – Strona szczegółów

1. Skopiuj **`angebot-warschau.html`** → **`angebot-zielort.html`**
2. Zamień: cel, daty, lotniska, cena, opisy Flug/Unterkunft, hero, OG meta, canonical
3. **Reisevorschlag des Tages ID** (w prawej ramce checkout): format `TF-MIEJSCE-DDMMYYYY` od daty wylotu; każde ID tylko raz
4. Link **Jetzt bestellen** → `/reisevorschlag-des-tages?rid=TF-…` (ten sam ID)
5. Dopisz ID w **`script.js`** (`VALID_REISEVORSCHLAG_IDS`) **oraz** w **`api/_lib/reisevorschlag-ids.js`**
6. **Bestellnummer** (`TF-001`…) nadaje się automatycznie po płatności
7. Dolny **Hinweis** zostaw bez zmian
8. Dodaj URL do **`sitemap.xml`**

## Krok 3 – Karta na liście

W **`reisevorschlaege.html`**:
1. Wklej **na górze** `.daily-offers-list` nową kartę (wzór: karta Warschau / komentarz HTML w pliku)
2. Link np. `href="/angebot-kreta"`

## Krok 4 – Online

```powershell
git add .
git commit -m "Neues Angebot: Kreta"
git push
```

## Podgląd lokalny

- `npm run dev` → http://localhost:3000/reisevorschlaege
- Przykład: http://localhost:3000/angebot-warschau

## Usuwanie starej oferty

1. Usuń kartę z `reisevorschlaege.html`
2. Usuń plik `angebot-….html`
3. Usuń ID z `script.js` i `api/_lib/reisevorschlag-ids.js`
4. Usuń wpis z `sitemap.xml` (opcjonalnie redirect w `vercel.json`)
