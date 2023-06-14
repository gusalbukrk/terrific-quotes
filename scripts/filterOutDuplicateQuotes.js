import fs from 'fs';
import { compareTwoStrings } from 'string-similarity';

const db = JSON.parse(fs.readFileSync('./db.json', 'utf8'));
const brainyquotes = JSON.parse(fs.readFileSync('./brainyquotes.json', 'utf8'));

for (const [ author, quotes ] of Object.entries(brainyquotes)) {
  console.log(author);

  const authorQuotesOnDB = db.quotes.filter(q => q[0] === db.authors.find(a => a[1] === author)[0]).map(q => q[2]);

  const unique = quotes.filter(quote => {
    const match = authorQuotesOnDB.find(q => compareTwoStrings(q, quote) >= 0.8);
    return match === undefined;
  });

  brainyquotes[author] = unique;

  fs.writeFileSync('./brainyquotes.json', JSON.stringify(brainyquotes, null, 2));
}

