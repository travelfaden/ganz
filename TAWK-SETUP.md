# Jak Podpiąć Tawk.to do Lokalnej Strony

## ✅ TAK - Możesz testować lokalnie!

Tawk.to działa również na lokalnych plikach HTML (file://), więc możesz przetestować chat bezpośrednio z komputera, bez potrzeby hostingu online.

---

## Krok po Kroku - Instalacja Tawk.to

### Krok 1: Załóż konto Tawk.to

1. Przejdź na **https://www.tawk.to/**
2. Kliknij **"Sign Up Free"** (Zarejestruj się za darmo)
3. Wypełnij formularz:
   - Email
   - Hasło
   - Nazwa firmy (np. "Travel Faden")
4. Potwierdź email

### Krok 2: Utwórz Widget

1. Po zalogowaniu kliknij **"Add Widget"** lub **"Add Chat Widget"**
2. Wybierz **"Add to Website"**
3. Wypełnij podstawowe informacje:
   - **Website Name:** Travel Faden
   - **Website URL:** Możesz wpisać `http://localhost` lub `file://` (nie jest wymagane dla lokalnego testowania)
4. Kliknij **"Continue"**

### Krok 3: Skopiuj Kod

1. Po utworzeniu widgetu zobaczysz kod JavaScript
2. Skopiuj **cały kod** - wygląda mniej więcej tak:

```javascript
<!--Start of Tawk.to Script-->
<script type="text/javascript">
var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function(){
var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
s1.async=true;
s1.src='https://embed.tawk.to/YOUR_PROPERTY_ID/YOUR_WIDGET_ID';
s1.charset='UTF-8';
s1.setAttribute('crossorigin','*');
s0.parentNode.insertBefore(s1,s0);
})();
</script>
<!--End of Tawk.to Script-->
```

### Krok 4: Dodaj Kod do Strony

1. Otwórz plik `index.html`
2. Znajdź sekcję z obecnym chatem (około linii 181-213)
3. **Zakomentuj** obecny chat widget:

```html
<!-- 
<div class="chat-widget" id="chatWidget">
    ...
</div>
<button class="chat-toggle" id="chatToggle">
    ...
</button>
-->
```

4. **Dodaj kod Tawk.to** przed `</body>` (przed `</html>`):

```html
<!--Start of Tawk.to Script-->
<script type="text/javascript">
var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function(){
var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
s1.async=true;
s1.src='https://embed.tawk.to/YOUR_PROPERTY_ID/YOUR_WIDGET_ID';
s1.charset='UTF-8';
s1.setAttribute('crossorigin','*');
s0.parentNode.insertBefore(s1,s0);
})();
</script>
<!--End of Tawk.to Script-->
```

5. **WAŻNE:** Zastąp `YOUR_PROPERTY_ID` i `YOUR_WIDGET_ID` swoimi prawdziwymi ID z Tawk.to

### Krok 5: Przetestuj Lokalnie

1. Otwórz plik `index.html` w przeglądarce (podwójne kliknięcie)
2. Powinieneś zobaczyć widget Tawk.to w prawym dolnym rogu
3. Kliknij na widget i napisz wiadomość testową
4. Otwórz panel Tawk.to w drugiej karcie przeglądarki
5. Zobaczysz swoją wiadomość w panelu!

---

## Co Będzie Działać Lokalnie:

✅ **Widget chat** - pojawi się na stronie  
✅ **Wysyłanie wiadomości** - możesz pisać wiadomości  
✅ **Odbieranie wiadomości** - zobaczysz je w panelu Tawk.to  
✅ **Odpowiadanie** - możesz odpowiadać z panelu  
✅ **Aplikacja mobilna** - możesz odpowiadać z telefonu  
✅ **Powiadomienia** - dostaniesz powiadomienia o wiadomościach  

---

## Jak Przetestować:

### Test 1: Jako Użytkownik
1. Otwórz `index.html` w przeglądarce
2. Kliknij widget chat
3. Napisz: "Test wiadomości"
4. Wyślij

### Test 2: Jako Operator
1. Otwórz **https://dashboard.tawk.to/** w innej karcie
2. Zaloguj się
3. Zobaczysz wiadomość testową
4. Odpowiedz na nią
5. Wróć do strony - zobaczysz swoją odpowiedź!

### Test 3: Z Telefonu
1. Otwórz `index.html` na telefonie (przez WiFi)
2. Napisz wiadomość
3. Otwórz aplikację Tawk.to na telefonie
4. Zobaczysz wiadomość i możesz odpowiedzieć

---

## Alternatywa: Ukryj Obecny Chat

Zamiast usuwać obecny chat, możesz go po prostu ukryć w CSS:

```css
.chat-widget,
.chat-toggle {
    display: none !important;
}
```

Wtedy możesz łatwo wrócić do demo chatu, jeśli będziesz chciał.

---

## Rozwiązywanie Problemów

**Problem:** Widget się nie pojawia
- **Rozwiązanie:** Sprawdź czy kod jest przed `</body>`, nie przed `</html>`
- Sprawdź czy ID są poprawne
- Otwórz konsolę przeglądarki (F12) i sprawdź błędy

**Problem:** Nie widzę wiadomości w panelu
- **Rozwiązanie:** Odśwież panel Tawk.to
- Sprawdź czy jesteś zalogowany
- Sprawdź czy widget jest aktywny w ustawieniach

**Problem:** Widget wygląda inaczej niż oczekiwany
- **Rozwiązanie:** Możesz dostosować wygląd w panelu Tawk.to → Settings → Widget

---

## Podsumowanie

✅ **TAK** - możesz testować Tawk.to lokalnie  
✅ **TAK** - wszystko będzie działać  
✅ **TAK** - możesz odpowiadać z panelu/aplikacji  
✅ **TAK** - możesz testować z telefonu  

**Następny krok:** Załóż konto, dodaj kod do strony i przetestuj!

