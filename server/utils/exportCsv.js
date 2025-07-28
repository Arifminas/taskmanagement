const { Parser } = require('json2csv');

const exportToCsv = (data, fields = []) => {
  try {
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(data);
    return csv;
  } catch (err) {
    console.error('CSV export error:', err);
    throw err;
  }
};

module.exports = exportToCsv;
