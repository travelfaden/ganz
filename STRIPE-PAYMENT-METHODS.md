# Metody Płatności w Stripe

## Obsługiwane Metody Płatności

Stripe obsługuje wiele metod płatności:

### 1. **Karty Kredytowe/Debetowe** ✅
- Visa, Mastercard, American Express
- Domyślnie włączone
- Kod: `'card'`

### 2. **PayPal** ✅
- Obsługiwane w wielu krajach (w tym Polska)
- Klient jest przekierowywany do PayPal do autoryzacji
- Kod: `'paypal'`

### 3. **Apple Pay** ✅
- Dla użytkowników Apple (iOS, macOS, Safari)
- Automatycznie dostępne jeśli klient używa urządzenia Apple
- Kod: `'card'` (automatycznie pokazuje się Apple Pay)

### 4. **Google Pay** ✅
- Dla użytkowników Android/Chrome
- Automatycznie dostępne jeśli klient używa Chrome/Android
- Kod: `'card'` (automatycznie pokazuje się Google Pay)

### 5. **Inne metody** (w zależności od regionu):
- **Blik** (Polska) - przez Stripe
- **Przelewy bankowe** (SEPA, ACH)
- **Klarna** (raty)
- **iDEAL** (Holandia)
- **Sofort** (Niemcy, Austria)
- I wiele innych...

## Jak Dodać PayPal

### W Backend (backend-example.js):

```javascript
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card', 'paypal'], // Dodaj 'paypal'
  // ... reszta konfiguracji
});
```

### Wymagania dla PayPal:

1. **Konto Stripe** musi być w pełni zweryfikowane
2. **PayPal** musi być dostępny w Twoim regionie
3. **Waluta** - PayPal obsługuje wiele walut (EUR, USD, PLN, itp.)

## Przykład Pełnej Konfiguracji

```javascript
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card', 'paypal'],
  line_items: [
    {
      price_data: {
        currency: 'eur', // lub 'pln' dla Polski
        product_data: {
          name: 'Usługa Travel Faden',
        },
        unit_amount: amount * 100,
      },
      quantity: 1,
    },
  ],
  mode: 'payment',
  success_url: '...',
  cancel_url: '...',
});
```

## Jak to Działa z PayPal:

1. Klient wybiera PayPal jako metodę płatności
2. Zostaje przekierowany do strony PayPal
3. Loguje się do PayPal i autoryzuje płatność
4. Zostaje przekierowany z powrotem na Twoją stronę sukcesu
5. Otrzymujesz powiadomienie o płatności przez webhook

## Testowanie PayPal:

W trybie testowym Stripe:
- Użyj testowego konta PayPal
- Lub użyj testowych danych PayPal w Stripe Dashboard

## Sprawdzenie Dostępności:

PayPal jest dostępny w:
- 🇵🇱 Polska ✅
- 🇪🇺 Większość krajów UE ✅
- 🇺🇸 USA ✅
- 🇬🇧 UK ✅
- I wiele innych...

## Więcej Informacji:

- [Dokumentacja Stripe PayPal](https://docs.stripe.com/payments/paypal)
- [Obsługiwane lokalizacje PayPal](https://docs.stripe.com/payments/paypal/supported-locales)
- [Stripe Dashboard](https://dashboard.stripe.com/) - sprawdź dostępne metody płatności




