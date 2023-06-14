import fs from 'fs';

const db = JSON.parse(fs.readFileSync('./db.json', 'utf8'));

db.authors = db.authors.map(author => {
  author[2] = author[2].map(bio => {
    return bio.replace(/\.$/, '');
  });

  return author;
});

fs.writeFileSync('./db.json', JSON.stringify(db, null, 2));
