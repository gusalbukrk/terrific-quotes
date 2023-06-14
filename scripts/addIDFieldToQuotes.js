import fs from 'fs';

const db = JSON.parse(fs.readFileSync('./db.json', 'utf8'));

db.quotes.forEach((quote, index) => {
  quote.unshift(index);
});

fs.writeFileSync('./db.json', JSON.stringify(db, null, 2));
