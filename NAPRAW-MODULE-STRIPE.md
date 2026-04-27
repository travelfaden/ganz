# 🔧 Naprawa: Cannot find module 'stripe'

## ❌ Problem

Błąd: `Cannot find module 'stripe'`

To oznacza, że Vercel nie zainstalował pakietów Node.js.

---

## ✅ Rozwiązanie

### KROK 1: Sprawdź czy `package.json` jest w GitHub

1. Przejdź do swojego repozytorium na GitHub
2. Sprawdź czy widzisz plik `package.json` w głównym folderze
3. Kliknij na `package.json` i sprawdź czy zawiera:

```json
{
  "dependencies": {
    "stripe": "^14.0.0",
    "resend": "^3.2.0"
  }
}
```

**Jeśli NIE widzisz `package.json` w GitHub:**
- Musisz go dodać do Git!

---

### KROK 2: Dodaj `package.json` do Git (jeśli nie jest w GitHub)

1. Otwórz GitHub Desktop (lub terminal)
2. Zobaczysz `package.json` jako niezacommitowany plik
3. Zaznacz `package.json`
4. Commit: "Add package.json with dependencies"
5. Push do GitHub

---

### KROK 3: Sprawdź konfigurację Vercel

1. Vercel Dashboard → **Settings** → **General**
2. Sprawdź **"Framework Preset"** - powinno być "Other" lub automatycznie wykryte
3. Sprawdź **"Build Command"** - może być puste (Vercel wykryje automatycznie)
4. Sprawdź **"Install Command"** - powinno być `npm install` lub puste

---

### KROK 4: Redeploy

Po dodaniu `package.json` do GitHub:

1. Vercel automatycznie wykryje zmiany i zrobi nowy deployment
2. LUB zrób ręczny redeploy:
   - Deployments → "..." → Redeploy
   - **ODZNACZ** "Use existing Build Cache"
   - Redeploy

---

## 🔍 Sprawdź czy działa

Po redeploy sprawdź logi builda:

1. Vercel Dashboard → **Deployments**
2. Kliknij na nowy deployment
3. Kliknij **"Build Logs"**
4. Szukaj:
   - ✅ "Installing dependencies" - OK!
   - ✅ "npm install" - OK!
   - ❌ "No package.json found" - problem!

---

## 📋 Checklist

- [ ] `package.json` jest w GitHub
- [ ] `package.json` zawiera `stripe` i `resend` w dependencies
- [ ] Zrobiłem commit i push `package.json`
- [ ] Vercel zrobił nowy deployment
- [ ] W Build Logs widzę "Installing dependencies"

---

## 🆘 Jeśli nadal nie działa

Sprawdź czy w Build Logs widzisz:
- "Installing dependencies" - jeśli NIE, Vercel nie widzi package.json
- "No package.json found" - package.json nie jest w GitHub

**Rozwiązanie:**
1. Upewnij się, że `package.json` jest w głównym folderze projektu
2. Upewnij się, że jest w GitHub
3. Zrób redeploy bez cache

---

## ✅ Szybka naprawa

Jeśli `package.json` nie jest w GitHub:

1. **GitHub Desktop:**
   - Zaznacz `package.json`
   - Commit: "Add package.json"
   - Push

2. **Terminal:**
   ```bash
   git add package.json
   git commit -m "Add package.json"
   git push
   ```

3. **Vercel automatycznie zredeployuje!**

---

Daj znać czy `package.json` jest w GitHub! 😊
