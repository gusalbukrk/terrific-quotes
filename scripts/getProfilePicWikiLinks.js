import fs from 'fs';

const authors = JSON.parse(fs.readFileSync('db.json', 'utf8')).authors;
const picsLinks = JSON.parse(fs.readFileSync('picsLinks.json', 'utf8'));

for (const [,author] of authors) {
  if (picsLinks[author]) continue;
  console.log(author);

  const resp = await (await fetch(`https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&piprop=original&redirects&titles=${author}`)).json();

  const link = resp.query.pages[Object.keys(resp.query.pages)[0]].original?.source;

  picsLinks[author] = link === undefined ? null : link;
  fs.writeFileSync('picsLinks.json', JSON.stringify(picsLinks, null, 2));
}
