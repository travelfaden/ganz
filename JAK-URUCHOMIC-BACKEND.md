# Jak Uruchomić Backend

## Szybka Instrukcja

### Krok 1: Otwórz PowerShell
- Naciśnij `Windows + R`
- Wpisz `powershell` i naciśnij Enter
- Lub wyszukaj "PowerShell" w menu Start

### Krok 2: Przejdź do katalogu projektu
```powershell
cd C:\Users\uciek\website
```

### Krok 3: Dodaj Node.js do PATH (jeśli potrzebne)
```powershell
$env:PATH += ";C:\Program Files\nodejs"
```

### Krok 4: Uruchom backend
```powershell
node backend-example.js
```

### Krok 5: Sprawdź czy działa
Powinieneś zobaczyć:
```
Serwer działa na porcie 3000
Stripe endpoint: http://localhost:3000/api/create-checkout-session
```

## ✅ Gotowe!

Teraz możesz otworzyć w przeglądarce:
```
http://localhost:3000/test-stripe.html
```

## ⚠️ Ważne

- **NIE zamykaj** okna PowerShell - backend musi działać w tle
- Jeśli zamkniesz okno, backend przestanie działać
- Aby zatrzymać backend, naciśnij `Ctrl+C` w oknie PowerShell

## 🔧 Jeśli port 3000 jest zajęty

Jeśli zobaczysz błąd `EADDRINUSE: address already in use :::3000`:

1. Zatrzymaj wszystkie procesy Node.js:
```powershell
Get-Process -Name node | Stop-Process -Force
```

2. Poczekaj 2-3 sekundy

3. Uruchom backend ponownie:
```powershell
node backend-example.js
```

## 📝 Alternatywa: Uruchom w tle

Jeśli chcesz uruchomić backend w tle (bez okna PowerShell):

```powershell
$env:PATH += ";C:\Program Files\nodejs"
cd C:\Users\uciek\website
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; `$env:PATH += ';C:\Program Files\nodejs'; node backend-example.js"
```

## 🚀 Szybki Start (Jedna Komenda)

Skopiuj i wklej to do PowerShell:

```powershell
$env:PATH += ";C:\Program Files\nodejs"; cd C:\Users\uciek\website; node backend-example.js
```




