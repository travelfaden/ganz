# 🎨 Jak Zmienić Szablon Vouchera

## 📍 Gdzie jest szablon?

Szablon emaila z voucherem znajduje się w pliku:
**`api/webhook.js`**

Funkcja: `createVoucherEmailTemplate()` (linie 42-103)

---

## 🎨 Co możesz zmienić?

### 1. Kolory

W sekcji `<style>` (linie 50-60) możesz zmienić:

```css
.header { 
  background: linear-gradient(135deg, #2563eb, #0ea5e9); /* Zmień kolory */
  color: white; 
}

.voucher-box { 
  border: 2px dashed #2563eb; /* Zmień kolor ramki */
}

.voucher-number { 
  color: #2563eb; /* Zmień kolor numeru vouchera */
}

.voucher-amount { 
  color: #0ea5e9; /* Zmień kolor kwoty */
}

.button { 
  background: linear-gradient(135deg, #2563eb, #0ea5e9); /* Zmień kolory przycisku */
}
```

**Przykład zmiany kolorów:**
```css
.header { 
  background: linear-gradient(135deg, #ff6b6b, #ee5a6f); /* Czerwony gradient */
}
```

---

### 2. Tekst

W sekcji HTML (linie 64-97) możesz zmienić:

- **Nagłówek:** "🎉 Dziękujemy za zakup!" (linia 65)
- **Nazwa firmy:** "Travel Faden" (linia 66)
- **Tekst powitalny:** "Witaj ${name}," (linia 69)
- **Opis vouchera:** "Ten voucher możesz wykorzystać..." (linia 79)
- **Lista kroków:** "Co dalej?" (linia 85)
- **Stopka:** "Travel Faden - Idealne wakacje dla Ciebie" (linia 95)

---

### 3. Link do strony

W linii 82 możesz zmienić link:

```html
<a href="https://twoja-domena.pl" class="button">Zobacz Oferty</a>
```

Zamień `https://twoja-domena.pl` na swój prawdziwy URL (np. `https://ganz-neon.vercel.app`)

---

### 4. Logo (opcjonalnie)

Możesz dodać logo w sekcji header:

```html
<div class="header">
  <img src="https://twoja-domena.pl/logo.png" alt="Travel Faden" style="max-width: 150px; margin-bottom: 20px;">
  <h1>🎉 Dziękujemy za zakup!</h1>
  <p>Travel Faden</p>
</div>
```

---

### 5. Dodatkowe elementy

Możesz dodać:
- **Termin ważności:** "Voucher ważny do: [data]"
- **Warunki:** "Warunki korzystania z vouchera..."
- **Kontakt:** Dodatkowe informacje kontaktowe
- **Social media:** Linki do Facebook, Instagram

---

## 📝 Przykład zmiany

### Zmień kolory na czerwone:

```css
.header { 
  background: linear-gradient(135deg, #ff6b6b, #ee5a6f);
}
.voucher-number { 
  color: #ff6b6b;
}
.voucher-amount { 
  color: #ee5a6f;
}
```

### Zmień tekst:

```html
<h1>🎉 Dziękujemy za wybór Travel Faden!</h1>
<p>Twoja rezerwacja została potwierdzona</p>
```

---

## 🔧 Jak edytować?

1. Otwórz plik `api/webhook.js` w edytorze
2. Znajdź funkcję `createVoucherEmailTemplate` (linia 42)
3. Zmień kolory, tekst, linki według potrzeb
4. Zapisz plik
5. Commit i push do GitHub
6. Vercel automatycznie zredeployuje

---

## ✅ Po zmianach

1. **Commit i push** zmian
2. **Redeploy** w Vercel (automatycznie)
3. **Przetestuj** - wykonaj testową płatność
4. **Sprawdź email** - zobacz jak wygląda nowy szablon

---

## 💡 Wskazówki

- **Kolory:** Używaj kolorów zgodnych z Twoją marką
- **Tekst:** Pisz w języku, który rozumieją Twoi klienci
- **Linki:** Upewnij się, że linki działają
- **Responsywność:** Szablon jest responsywny (działa na telefonach)

---

## 🆘 Potrzebujesz pomocy?

Jeśli chcesz zmienić coś konkretnego, napisz mi:
- Co chcesz zmienić? (kolory, tekst, layout)
- Jak ma wyglądać?

Pomogę Ci to zrobić! 😊
