import fs from 'fs';

const db = JSON.parse(fs.readFileSync('./db.json', 'utf8'));
const allowedTags = JSON.parse(fs.readFileSync('./tags.json', 'utf8'));

for (const quote of db.quotes) {
  if (!Array.isArray(quote[3][0])) continue;

  const flat = quote[3].flat();
  const unique = Array.from(new Set(flat));

  const tags = unique.filter((tag) => flat.filter(t => t === tag).length >= 3);
  
  // console.log(quote[3]);
  console.log(tags);
  
  quote[3] = tags;
  fs.writeFileSync('./db.json', JSON.stringify(db, null, 2));
}
