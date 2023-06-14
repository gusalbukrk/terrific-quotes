import fs from 'fs';

const db = JSON.parse(fs.readFileSync('db.json', 'utf-8'));

// authors with quotes
const authors = db.authors.reduce((acc, author) => {
  const [, authorName] = author;

  const total = db.quotes.filter(q => q[0] === db.authors.find(a => a[1] === authorName)[0]).length;

  return total === 0 ? acc : [ ...acc, author];
}, []);

fs.writeFileSync('db.json', JSON.stringify({ ...db, authors }, null, 2));
