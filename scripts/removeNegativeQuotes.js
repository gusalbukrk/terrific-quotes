import fs from 'fs';

const qs = {};

for (const [ author, quotes ] of Object.entries(JSON.parse(fs.readFileSync('./quotes-graded.json', 'utf8')))) {
  const positiveQuotes = quotes.filter(q => q[0] >= 6);  

  // console.log(positiveQuotes);
  if (positiveQuotes.length > 0) qs[author] = positiveQuotes;
}

fs.writeFileSync('./quotes-positive.json', JSON.stringify(qs, null, 2));