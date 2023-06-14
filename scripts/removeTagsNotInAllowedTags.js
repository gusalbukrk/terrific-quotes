import fs from 'fs';

const db = JSON.parse(fs.readFileSync('./db.json', 'utf8'));
const allowedTags = JSON.parse(fs.readFileSync('./tags.json', 'utf8'));

for (let i = 0; i < db.quotes.length; i++) {
  // const quote = db.quotes[i];
  // let tags = quote[3];
  // console.log(Array.from(new Set(tags.flat())).filter(t => !allowedTags.includes(t)));
  
  db.quotes[i][3] = db.quotes[i][3].map(ts => ts.filter(t => allowedTags.includes(t)));

  fs.writeFileSync('./db.json', JSON.stringify(db, null, 2));
}
