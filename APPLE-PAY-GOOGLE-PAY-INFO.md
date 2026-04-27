# Apple Pay i Google Pay w Stripe Checkout

## Jak to działa:

Apple Pay i Google Pay są **automatycznie dostępne** przez `payment_method_types: ['card']` w Stripe Checkout, ale pojawiają się tylko w określonych warunkach:

### Apple Pay:
- ✅ **Działa na:** Safari na iOS/macOS, Chrome na iOS
- ✅ **Wymagania:**
  - Urządzenie Apple (iPhone, iPad, Mac)
  - Safari lub Chrome na iOS
  - Karta dodana do Apple Wallet
  - Domena zweryfikowana w Stripe Dashboard (dla produkcji)

### Google Pay:
- ✅ **Działa na:** Chrome na Android/Windows/Mac, Edge na Windows
- ✅ **Wymagania:**
  - Chrome lub Edge
  - Karta dodana do Google Pay
  - HTTPS (w produkcji) lub localhost (w testach)

## Dlaczego nie widzisz przycisków?

1. **Testujesz na niewłaściwym urządzeniu:**
   - Apple Pay: tylko na urządzeniach Apple
   - Google Pay: tylko w Chrome/Edge

2. **Brak kart w portfelu:**
   - Apple Pay: karta musi być w Apple Wallet
   - Google Pay: karta musi być w Google Pay

3. **Brak weryfikacji domeny (produkcja):**
   - Apple Pay wymaga weryfikacji domeny w Stripe Dashboard

## Jak przetestować:

### Apple Pay:
1. Użyj iPhone/iPad/Mac
2. Otwórz Safari lub Chrome
3. Upewnij się, że masz kartę w Apple Wallet
4. Otwórz formularz płatności

### Google Pay:
1. Użyj Chrome lub Edge
2. Upewnij się, że masz kartę w Google Pay
3. Otwórz formularz płatności

## Konfiguracja w Stripe Dashboard:

1. Zaloguj się do [Stripe Dashboard](https://dashboard.stripe.com/)
2. Przejdź do **Settings → Payment methods**
3. Włącz **Apple Pay** i **Google Pay**
4. Dla Apple Pay: zweryfikuj domenę (Settings → Apple Pay)

## W kodzie:

W `backend-example.js` masz:
```javascript
payment_method_types: ['card', 'paypal']
```

To jest **poprawne** - Apple Pay i Google Pay są automatycznie dostępne przez `'card'`!

## Alternatywa: Stripe Elements

Jeśli chcesz mieć pełną kontrolę i widzieć przyciski zawsze, użyj **Stripe Elements** zamiast Checkout (przykład: `stripe-elements-example.html`).




