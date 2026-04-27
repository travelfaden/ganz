# Instrukcja Live Chat dla Travel Faden

## Obecna Implementacja

Strona ma wbudowany widget live chat z podstawową funkcjonalnością. Chat działa w trybie demo z automatycznymi odpowiedziami.

## Funkcje

✅ Przycisk chat w prawym dolnym rogu  
✅ Otwieranie/zamykanie widgetu  
✅ Wysyłanie wiadomości  
✅ Automatyczne odpowiedzi (demo)  
✅ Responsywny design  
✅ Animacje i efekty wizualne  

## Integracja z Zewnętrznymi Serwisami

### Opcja 1: Tawk.to (Darmowe)

1. Zarejestruj się na https://www.tawk.to/
2. Utwórz widget
3. Skopiuj kod JavaScript
4. Dodaj do `index.html` przed `</body>`:

```html
<!-- Tawk.to Script -->
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
```

5. Usuń lub zakomentuj obecny widget chat w HTML

### Opcja 2: Crisp (Darmowe)

1. Zarejestruj się na https://crisp.chat/
2. Dodaj swój website
3. Skopiuj kod JavaScript
4. Dodaj do `index.html` przed `</body>`:

```html
<!-- Crisp Script -->
<script type="text/javascript">
window.$crisp=[];
window.CRISP_WEBSITE_ID="YOUR_WEBSITE_ID";
(function(){
d=document;
s=d.createElement("script");
s.src="https://client.crisp.chat/l.js";
s.async=1;
d.getElementsByTagName("head")[0].appendChild(s);
})();
</script>
```

### Opcja 3: Intercom (Płatne, ale profesjonalne)

1. Zarejestruj się na https://www.intercom.com/
2. Skonfiguruj widget
3. Dodaj kod JavaScript do strony

### Opcja 4: Własny Backend

Jeśli chcesz stworzyć własny system chat, możesz:

1. **Stworzyć backend API** do obsługi wiadomości
2. **Użyć WebSockets** (Socket.io, Pusher) dla komunikacji w czasie rzeczywistym
3. **Zintegrować z bazą danych** do przechowywania historii rozmów

Przykład integracji z backendem:

```javascript
// W script.js, zamiast automatycznych odpowiedzi:
chatSend.addEventListener('click', async () => {
    const message = chatInput.value.trim();
    if (message) {
        sendMessage(message, true);
        chatInput.value = '';
        
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message }),
            });
            
            const data = await response.json();
            sendMessage(data.response, false);
        } catch (error) {
            sendMessage('Przepraszamy, wystąpił błąd. Spróbuj ponownie później.', false);
        }
    }
});
```

## Dostosowanie

### Zmiana Kolorów

W pliku `styles.css` znajdź sekcję `/* Live Chat Widget */` i zmień:
- `var(--primary-color)` - główny kolor
- `var(--secondary-color)` - kolor gradientu

### Zmiana Pozycji

W `styles.css` zmień:
```css
.chat-toggle {
    bottom: 20px;  /* Odległość od dołu */
    right: 20px;   /* Odległość od prawej */
}
```

### Automatyczne Otwieranie

Odkomentuj w `script.js`:
```javascript
setTimeout(() => {
    if (!localStorage.getItem('chatOpened')) {
        chatToggle.click();
        localStorage.setItem('chatOpened', 'true');
    }
}, 3000);
```

### Własne Odpowiedzi Bot

W `script.js` znajdź tablicę `responses` i dodaj własne odpowiedzi:
```javascript
const responses = [
    'Twoja własna odpowiedź 1',
    'Twoja własna odpowiedź 2',
    // ...
];
```

## Rekomendacje

- **Dla małych firm**: Tawk.to (darmowe, łatwe w użyciu)
- **Dla profesjonalnych firm**: Intercom lub Crisp
- **Dla pełnej kontroli**: Własny backend z WebSockets

## Wsparcie

- Tawk.to: https://www.tawk.to/knowledgebase/
- Crisp: https://help.crisp.chat/
- Intercom: https://www.intercom.com/help

