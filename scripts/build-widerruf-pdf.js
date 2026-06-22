const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const root = path.join(__dirname, '..');
const outDir = path.join(root, 'documents');
const outPath = path.join(outDir, 'muster-widerrufsformular.pdf');

const LINE = '_______________________________________________';

function drawLineField(doc, label) {
  doc.fontSize(11).fillColor('#0f172a').text(label);
  doc.moveDown(0.15);
  doc.fontSize(11).fillColor('#334155').text(LINE);
  doc.moveDown(0.75);
}

function buildPdf() {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(outDir, { recursive: true });

    const doc = new PDFDocument({ margin: 56, size: 'A4' });
    const stream = fs.createWriteStream(outPath);

    doc.pipe(stream);
    stream.on('finish', () => resolve(outPath));
    stream.on('error', reject);
    doc.on('error', reject);

    doc.fontSize(18).fillColor('#2563eb').text('Travel Faden', { align: 'left' });
    doc.moveDown(0.25);
    doc.fontSize(14).fillColor('#0f172a').text('Muster-Widerrufsformular', { underline: true });
    doc.moveDown(1);

    doc.fontSize(11).fillColor('#334155');
    doc.text(
      'Wenn Sie den Vertrag widerrufen wollen, füllen Sie bitte dieses Formular aus und senden Sie es zurück an:',
      { align: 'left' }
    );
    doc.moveDown(0.75);

    doc.text('Travel Faden');
    doc.text('Bartosz Nagiec');
    doc.text('Pönitzer Weg 2a');
    doc.text('23684 Scharbeutz');
    doc.text('Deutschland');
    doc.text('E-Mail: travelfaden@gmail.com');
    doc.moveDown(1.25);

    doc.fontSize(12).fillColor('#0f172a').text('Widerrufserklärung', { underline: true });
    doc.moveDown(0.75);

    doc.fontSize(11).fillColor('#334155');
    doc.text(
      'Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über die Erbringung der folgenden Dienstleistung:'
    );
    doc.moveDown(0.75);

    drawLineField(doc, '');
    drawLineField(doc, 'Bestellt am (*) _______________ / erhalten am (*) _______________');
    drawLineField(doc, 'Name des/der Verbraucher(s):');
    drawLineField(doc, 'Anschrift des/der Verbraucher(s):');
    drawLineField(
      doc,
      'Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier):'
    );
    drawLineField(doc, 'Datum:');

    doc.moveDown(0.25);
    doc.fontSize(10).fillColor('#64748b').text('(*) Unzutreffendes streichen.');

    doc.end();
  });
}

buildPdf()
  .then((file) => {
    console.log('Created', file);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
