# Jak Wyłączyć Stripe Link

## Ważne:

Stripe Link **nie jest osobną metodą płatności** w kodzie - jest automatycznie dostępny przez `payment_method_types: ['card']`.

Nie można go wyłączyć w kodzie - trzeba to zrobić w **Stripe Dashboard**.

## Instrukcja:

### Krok 1: Zaloguj się do Stripe Dashboard
1. Przejdź na: https://dashboard.stripe.com/
2. Zaloguj się na swoje konto

### Krok 2: Przejdź do Ustawień Metod Płatności
1. W menu po lewej kliknij **Settings** (Ustawienia)
2. Kliknij **Payment methods** (Metody płatności)

### Krok 3: Wyłącz Stripe Link
1. Znajdź **Stripe Link** na liście metod płatności
2. Kliknij na **Stripe Link**
3. Kliknij **Disable** (Wyłącz) lub **Remove** (Usuń)

### Krok 4: Zapisz Zmiany
- Zmiany są zapisywane automatycznie

## Po Wyłączeniu:

- Stripe Link nie będzie już widoczny w formularzu płatności
- Klienci będą widzieć tylko:
  - Karty kredytowe/debetowe
  - PayPal
  - Apple Pay (jeśli dostępne)
  - Google Pay (jeśli dostępne)

## Uwaga:

- Wyłączenie Stripe Link w Dashboard dotyczy **wszystkich** sesji Checkout
- Nie można wyłączyć Link tylko dla niektórych płatności
- Jeśli chcesz włączyć z powrotem, wykonaj te same kroki i kliknij **Enable**

## W Kodzie:

W `backend-example.js` masz:
```javascript
payment_method_types: ['card', 'paypal']
```

To jest **poprawne** - Stripe Link jest kontrolowany przez Dashboard, nie przez kod.




