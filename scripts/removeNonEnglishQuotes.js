import fs from 'fs';
import { detect } from 'tinyld'

const qs = {};

for (const [author, quotes] of Object.entries(JSON.parse(fs.readFileSync('goodreads-quotes.json', 'utf-8')))) {
  const englishOnlyQuotes = quotes.filter(q => detect(q) === 'en');

  if (englishOnlyQuotes.length > 0) qs[author] = englishOnlyQuotes;
}

fs.writeFileSync('goodreads-quotes.json', JSON.stringify(qs, null, 2));
