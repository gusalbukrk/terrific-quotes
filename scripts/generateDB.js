import fs from 'fs';

// add authors
// const authors = Object.entries(JSON.parse(fs.readFileSync('bios.json', 'utf8'))).map(([author, bios], index) => {
//   return [ index, author, bios ];
// });
// //
// fs.writeFileSync('db.json', JSON.stringify({ authors }, null, 2));

// add quotes
const db = JSON.parse(fs.readFileSync('db.json', 'utf8'));
//
const quotes = Object.entries(JSON.parse(fs.readFileSync('quotes-tags.json', 'utf8'))).reduce((acc, [author, quotes]) => {
  const authorID = db.authors.find(([id, name, bios]) => name === author)[0];

  const qs = quotes.map(([grade, quote, tags]) => [authorID, grade, quote, tags]);
  return [ ...acc, ...qs ];
}, []);

db.quotes = [ ...db.quotes, ...quotes ];

//
fs.writeFileSync('db.json', JSON.stringify(db, null, 2));
