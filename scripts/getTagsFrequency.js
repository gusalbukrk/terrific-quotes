import fs from 'fs';

const db = JSON.parse(fs.readFileSync('./db.json', 'utf8'));

const freq = {};

db.quotes.forEach(quote => {
  const tags = quote[3];

  tags.forEach(tag => {
    freq[tag] = freq[tag] ? freq[tag] + 1 : 1;
  });
});

console.log(freq);
