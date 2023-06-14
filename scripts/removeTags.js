import fs from 'fs';

const db = JSON.parse(fs.readFileSync('./db.json', 'utf8'));

db.quotes = db.quotes.map((quote) => {
  quote = quote.slice(0, -1);
  return quote;
});

fs.writeFileSync('./db.json', JSON.stringify(db, null, 2));
