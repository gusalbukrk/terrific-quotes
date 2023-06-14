import fs from 'fs';

const qs = {};

for (const [ author, quotes ] of Object.entries(JSON.parse(fs.readFileSync('./brainyquotes.json', 'utf8')))) {
  const shortQuotes = quotes.filter(q => q.length <= 250);

  if (shortQuotes.length > 0) qs[author] = shortQuotes;
}

fs.writeFileSync('./brainyquotes.json', JSON.stringify(qs, null, 2));