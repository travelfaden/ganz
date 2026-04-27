# 🔧 Naprawa Błędu 404 - Vercel

## ❌ Problem: Błąd 404 na endpointach

To oznacza, że Vercel nie widzi funkcji z folderu `/api`.

---

## ✅ Rozwiązanie Krok po Kroku

### KROK 1: Sprawdź czy folder `/api` jest w GitHub

1. Przejdź do swojego repozytorium na GitHub
2. Sprawdź czy widzisz folder `api/` z plikami:
   - `create-checkout-session.js`
   - `verify-session.js`
   - `webhook.js`
   - `send-test-email.js`
   - `send-contact-email.js`

**Jeśli NIE widzisz folderu `/api` w GitHub:**
- Pliki nie zostały zcommitowane
- Musisz je dodać do Git

---

### KROK 2: Dodaj pliki do Git (jeśli nie są w GitHub)

Otwórz terminal w folderze projektu i wykonaj:

```bash
# Sprawdź status
git status

# Dodaj folder api
git add api/

# Dodaj vercel.json
git add vercel.json

# Commit
git commit -m "Add Vercel serverless functions"

# Push do GitHub
git push
```

**LUB przez GitHub Desktop:**
1. Otwórz GitHub Desktop
2. Zobaczysz niezacommitowane pliki
3. Zaznacz folder `api/` i `vercel.json`
4. Napisz commit message: "Add Vercel serverless functions"
5. Kliknij "Commit to main"
6. Kliknij "Push origin"

---

### KROK 3: Sprawdź czy Vercel wykrył zmiany

1. Przejdź do **Vercel Dashboard**
2. Kliknij na swój projekt
3. Przejdź do zakładki **"Deployments"**
4. Powinieneś zobaczyć nowy deployment (lub w trakcie)
5. Poczekaj aż deployment się zakończy

---

### KROK 4: Sprawdź czy funkcje są wykryte

1. W Vercel Dashboard → **Deployments**
2. Kliknij na najnowszy deployment
3. Kliknij **"Functions"**
4. Powinieneś zobaczyć listę funkcji:
   - `api/create-checkout-session`
   - `api/verify-session`
   - `api/webhook`
   - `api/send-test-email`
   - `api/send-contact-email`

**Jeśli widzisz funkcje** - wszystko OK!  
**Jeśli NIE widzisz funkcji** - przejdź do KROKU 5

---

### KROK 5: Sprawdź konfigurację Vercel

1. Vercel Dashboard → **Settings** → **General**
2. Sprawdź **"Root Directory"** - powinno być puste lub `.`
3. Sprawdź **"Build Command"** - może być puste (Vercel wykryje automatycznie)
4. Sprawdź **"Output Directory"** - może być puste

---

### KROK 6: Wymuś Redeploy

1. Vercel Dashboard → **Deployments**
2. Kliknij **"..."** przy najnowszym deployment
3. Kliknij **"Redeploy"**
4. **ODZNACZ** "Use existing Build Cache"
5. Kliknij **"Redeploy"**

---

## 🔍 Diagnostyka

### Sprawdź czy pliki są w GitHub:

1. Otwórz: `https://github.com/twoj-username/twoj-repo`
2. Sprawdź czy widzisz folder `api/`
3. Kliknij na folder `api/`
4. Sprawdź czy widzisz pliki `.js`

**Jeśli NIE widzisz:**
- Pliki nie są w GitHub
- Wykonaj KROK 2 (dodaj do Git)

---

### Sprawdź logi builda w Vercel:

1. Vercel Dashboard → **Deployments**
2. Kliknij na deployment
3. Kliknij **"Build Logs"**
4. Sprawdź czy są błędy

**Szukaj:**
- "No functions found" - folder `/api` nie istnieje
- "Build failed" - błąd w kodzie
- "Functions detected" - wszystko OK!

---

## ✅ Szybka Checklista

- [ ] Folder `/api` istnieje lokalnie
- [ ] Folder `/api` jest w GitHub
- [ ] Plik `vercel.json` jest w GitHub
- [ ] Vercel zrobił nowy deployment po push
- [ ] W Deployments → Functions widzę funkcje
- [ ] Zrobiłem redeploy (bez cache)

---

## 🆘 Jeśli nadal nie działa

### Opcja 1: Sprawdź strukturę projektu

Upewnij się, że struktura wygląda tak:
```
twoja-strona/
├── api/
│   ├── create-checkout-session.js
│   ├── verify-session.js
│   ├── webhook.js
│   ├── send-test-email.js
│   └── send-contact-email.js
├── index.html
├── script.js
├── package.json
├── vercel.json
└── ... (pozostałe pliki)
```

### Opcja 2: Sprawdź czy Vercel wykrywa projekt jako Node.js

1. Vercel Dashboard → **Settings** → **General**
2. Sprawdź **"Framework Preset"** - powinno być "Other" lub "Vite"
3. Jeśli jest inaczej, zmień na "Other"

### Opcja 3: Utwórz nowy projekt w Vercel

1. Vercel Dashboard → **Add New Project**
2. Wybierz swoje repozytorium
3. Vercel automatycznie wykryje funkcje

---

## 📞 Co dokładnie widzisz?

Napisz mi:
1. Czy folder `/api` jest widoczny w GitHub?
2. Czy w Vercel → Deployments → Functions widzisz funkcje?
3. Jaki dokładny błąd widzisz? (404, czy coś innego?)

Pomogę dalej! 😊
