import fs from 'fs';

const db = JSON.parse(fs.readFileSync('./db.json', 'utf8'));

for (const quote of db.quotes) {
  const tags = quote[3].map(ts => ts.trim().split(/, ?/g).map(t => t.trim().toLowerCase()));
  console.log(tags);

  quote[3] = tags;
  fs.writeFileSync('./db.json', JSON.stringify(db, null, 2));
}
