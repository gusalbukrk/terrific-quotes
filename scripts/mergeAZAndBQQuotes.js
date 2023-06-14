import fs from 'fs';
import { compareTwoStrings } from 'string-similarity';

const azquotes = JSON.parse(fs.readFileSync('./azquotes.json', 'utf8'));
const brainyquotes = JSON.parse(fs.readFileSync('./brainyquotes.json', 'utf8'));

const authors = Array.from(new Set([ ...Object.keys(azquotes), ...Object.keys(brainyquotes) ])).sort();

const quotes = JSON.parse(fs.readFileSync('./quotes.json', 'utf8'));

for (const author of authors) {
  if (author in quotes) continue;

  const qs = author in azquotes ? azquotes[author] : [];

  if (author in brainyquotes) {
    qs.push(...brainyquotes[author].reduce((acc, bqQuote) => {
      const match = qs.find(q => compareTwoStrings(q, bqQuote) >= 0.8);

      if (match === undefined) return [... acc, bqQuote];
      return acc;
    }, []));
  }

  quotes[author] = qs;

  fs.writeFileSync('./quotes.json', JSON.stringify(quotes, null, 2));
}
