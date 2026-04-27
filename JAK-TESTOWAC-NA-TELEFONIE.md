# Jak Otworzyć Stronę Testową na Telefonie

## Krok 1: Znajdź Adres IP Komputera

### W PowerShell:
```powershell
ipconfig
```

Szukaj linii z "IPv4 Address" - to będzie coś jak:
- `192.168.1.100`
- `10.0.0.5`
- `172.16.0.10`

### Lub użyj tego polecenia:
```powershell
Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -like "192.168.*" -or $_.IPAddress -like "10.*" -or $_.IPAddress -like "172.*" } | Select-Object IPAddress
```

## Krok 2: Upewnij się, że Backend Działa

Backend musi działać na komputerze:
```powershell
node backend-example.js
```

Powinieneś zobaczyć:
```
Serwer działa na porcie 3000
```

## Krok 3: Połącz Telefon z Tą Samą Siecią WiFi

- Telefon i komputer muszą być w **tej samej sieci WiFi**
- To nie zadziała przez dane mobilne!

## Krok 4: Otwórz Stronę na Telefonie

W przeglądarce na telefonie wpisz:
```
http://TWOJ_IP:3000/test-stripe.html
```

Przykład:
```
http://192.168.1.100:3000/test-stripe.html
```

## Krok 5: Jeśli Nie Działa - Sprawdź Firewall

### Windows Firewall może blokować połączenia:

1. Otwórz "Zapora systemu Windows z zabezpieczeniami zaawansowanymi"
2. Kliknij "Reguły dla ruchu przychodzącego" → "Nowa reguła"
3. Wybierz "Port" → "TCP" → "Określone porty lokalne: 3000"
4. Wybierz "Zezwalaj na połączenie"
5. Zaznacz wszystkie profile (Domena, Prywatny, Publiczny)
6. Nadaj nazwę: "Node.js Backend Port 3000"

### Lub tymczasowo wyłącz Firewall (tylko do testów!):
1. Otwórz "Zapora systemu Windows"
2. Kliknij "Włącz lub wyłącz zaporę systemu Windows"
3. Wyłącz dla sieci prywatnej (tylko do testów!)
4. **Pamiętaj włączyć z powrotem po testach!**

## Alternatywa: Użyj ngrok (dla testów zewnętrznych)

Jeśli chcesz testować z dowolnego miejsca (nie tylko z sieci lokalnej):

1. Pobierz ngrok: https://ngrok.com/
2. Uruchom:
   ```bash
   ngrok http 3000
   ```
3. Skopiuj URL (np. `https://abc123.ngrok.io`)
4. Otwórz na telefonie: `https://abc123.ngrok.io/test-stripe.html`

## Testowanie Apple Pay / Google Pay:

### Apple Pay (iPhone/iPad):
- Otwórz w Safari
- Upewnij się, że masz kartę w Apple Wallet
- Apple Pay powinien się pojawić automatycznie

### Google Pay (Android):
- Otwórz w Chrome
- Upewnij się, że masz kartę w Google Pay
- Google Pay powinien się pojawić automatycznie

## Rozwiązywanie Problemów:

### Problem: "Nie można połączyć się z serwerem"
- ✅ Sprawdź, czy backend działa na komputerze
- ✅ Sprawdź, czy telefon jest w tej samej sieci WiFi
- ✅ Sprawdź adres IP (może się zmienić po restarcie routera)
- ✅ Sprawdź firewall Windows

### Problem: "Strona się ładuje, ale płatności nie działają"
- ✅ Sprawdź, czy backend odpowiada: `http://IP:3000`
- ✅ Sprawdź konsolę przeglądarki na telefonie (jeśli możliwe)
- ✅ Upewnij się, że używasz prawidłowego Publishable Key

## Szybki Test:

1. Na komputerze otwórz: `http://localhost:3000/test-stripe.html`
2. Jeśli działa, użyj adresu IP zamiast localhost
3. Na telefonie otwórz: `http://TWOJ_IP:3000/test-stripe.html`




