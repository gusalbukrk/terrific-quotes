import fs from 'fs';

const db = JSON.parse(fs.readFileSync('db.json', 'utf8'));

db.quotes.sort((a, b) => {
  const x = a[2].replace(/^[^\w]*/, '').toLowerCase(), y = b[2].replace(/^[^\w]*/, '').toLowerCase();

  if (x < y) return -1;
  if (x > y) return 1;
  return 0;
});

// console.log(db.quotes.map(quote => quote[2]));

fs.writeFileSync('db.json', JSON.stringify(db, null, 2));
