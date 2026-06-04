# Nowa oferta – Reisevorschlag des Tages (szablon JSON)

Od teraz **edytujesz głównie jeden plik**: `data/angebote.json`  
Lista i strona szczegółów budują się same.

## Podgląd lokalny (oferty z JSON)

Przy otwieraniu pliku z dysku (`file://`) **oferty się nie pokażą** — to normalne.

W terminalu:

```powershell
cd C:\Users\uciek\website
npm run preview
```

Potem w przeglądarce:

- Lista: **http://localhost:3000/oferta-dnia-nav.html**
- Mallorca: **http://localhost:3000/angebot.html?slug=mallorca**

Zatrzymanie serwera: `Ctrl+C` w terminalu.

*(W Cursor możesz też użyć „Live Preview” / rozszerzenia Live Server — ważne, żeby adres zaczynał się od `http://`, nie `file://`.)*

---

## Przepływ

```
oferta-dnia-nav.html  →  karty z JSON
angebot.html?slug=…   →  szczegóły z JSON
oferta-dnia.html      →  zakup 40 € (bez zmian)
```

---

## Nowa oferta w 3 krokach

### 1. Zdjęcie

Wrzuć do `images/`, np. `images/rom-2026.png`.

### 2. Edytuj `data/angebote.json`

Otwórz plik i **wklej nowy obiekt na początku** tablicy `"offers"` (najnowsza oferta pierwsza).

Wzór do skopiowania jest też w: **`data/angebote-VORLAGE.json`**

```json
{
  "slug": "rom",
  "destination": "Rom",
  "image": "images/rom-2026.png",
  "imageAlt": "Rom – Kolosseum bei Sonnenuntergang",
  "dateRange": "01.10.2026 – 05.10.2026",
  "departure": "Ab Berlin",
  "duration": "4 Tage",
  "priceHint": "ab 349 € pro Person",
  "description": [
    "Pierwszy akapit opisu po niemiecku.",
    "Drugi akapit: informacja o recherchie i linkach po zakupie usługi 40 €."
  ]
}
```

| Pole | Opis |
|------|------|
| `slug` | Krótki ID w URL: `angebot.html?slug=rom` (tylko małe litery, myślnik OK) |
| `destination` | Nazwa na liście i w nagłówku |
| `image` | Ścieżka do pliku w `images/` |
| `imageAlt` | Tekst alternatywny obrazka |
| `dateRange` | Daty na karcie i w meta |
| `departure` | Np. `Ab Hamburg` |
| `duration` | Np. `4 Tage` |
| `priceHint` | Np. `ab 299 € pro Person` |
| `description` | Tablica akapitów (każdy string = jeden `<p>`) |

Opcjonalnie: `"active": false` — ukrywa ofertę bez usuwania.

### 3. Opublikuj

```powershell
cd C:\Users\uciek\website
git add data/angebote.json images/TWOJE-ZDJECIE.png
git commit -m "Neues Angebot: Rom"
git push
```

---

## Walidacja JSON

Przed zapisem sprawdź na [jsonlint.com](https://jsonlint.com) — **przecinek** po każdym obiekcie oferty (oprócz ostatniego w tablicy), cudzysłowy `"`.

---

## Stary link Mallorca

`angebot-mallorca.html` przekierowuje na `angebot.html?slug=mallorca`.

---

## Pliki techniczne (nie trzeba ruszać przy każdej ofercie)

| Plik | Rola |
|------|------|
| `data/angebote.json` | **Twoje dane** |
| `js/daily-offers.js` | Render listy i szczegółów |
| `angebot.html` | Szablon strony szczegółów |
| `oferta-dnia-nav.html` | Lista (pusta, wypełnia JS) |
| `oferta-dnia.html` | Płatność 40 € |

---

## Checklista

- [ ] Zdjęcie w `images/`
- [ ] Nowy wpis **na górze** `offers` w `data/angebote.json`
- [ ] Unikalny `slug`
- [ ] JSON poprawny składniowo
- [ ] `git push`
- [ ] Test: lista → szczegóły → Jetzt bestellen → oferta-dnia
