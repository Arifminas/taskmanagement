const PDFDocument = require('pdfkit');

const exportToPdf = (data, res, title = 'Report') => {
  const doc = new PDFDocument({ margin: 30, size: 'A4' });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=${title}.pdf`);

  doc.fontSize(18).text(title, { align: 'center' }).moveDown();

  data.forEach(item => {
    doc.fontSize(12).text(JSON.stringify(item), { paragraphGap: 10 });
  });

  doc.end();
  doc.pipe(res);
};

module.exports = exportToPdf;
