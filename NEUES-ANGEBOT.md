# Nowa oferta – Reisevorschlag des Tages

**Szablon strony:** `angebot-mallorca.html`  
**Lista:** `oferta-dnia-nav.html` (karta na górze listy)

## Krok 1 – Zdjęcie

Wrzuć do `images/`, np. `images/kreta-2026.png`

## Krok 2 – Strona szczegółów

1. Skopiuj **`angebot-mallorca.html`** → **`angebot-kreta.html`**
2. Zamień (Ctrl+H): Mallorca → Kreta, zdjęcie, daty, teksty, `<title>`
3. Zostaw: link **Jetzt bestellen** → `oferta-dnia.html`, dolny **Wichtiger Hinweis**

## Krok 3 – Karta na liście

W **`oferta-dnia-nav.html`** wklej **na górze** `<div class="daily-offers-list">` nową kartę (wzór: Mallorca), link:

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
