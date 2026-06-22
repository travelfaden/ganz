const express = require('express');
const path = require('path');

const app = express();
const root = path.join(__dirname, '..');
const port = Number(process.env.PORT) || 3000;

// /strona.html -> /strona (jak cleanUrls na Vercel)
app.use((req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next();
  const match = req.path.match(/^\/(.+)\.html$/);
  if (match && match[1] !== 'index') {
    return res.redirect(301, `/${match[1]}`);
  }
  next();
});

// /strona -> strona.html
app.use(express.static(root, { extensions: ['html'], index: ['index.html'] }));

app.use((req, res) => {
  res.status(404).type('text/plain').send('404 – Seite nicht gefunden');
});

app.listen(port, () => {
  console.log('');
  console.log('  Travel Faden – lokalny podglad');
  console.log(`  http://localhost:${port}`);
  console.log('');
  console.log('  Przyklady: /reisevorschlaege, /flugvorschlaege');
  console.log('  API (/api/*) wymaga: npx vercel dev');
  console.log('');
});
