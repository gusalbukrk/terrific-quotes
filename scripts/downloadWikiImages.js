import fs from 'fs';

const links = Object.entries(JSON.parse(fs.readFileSync('picsLinks.json', 'utf8')));

for (const [ author, link ] of links) {
  const resp = await fetch(link);
  const buffer = await resp.arrayBuffer();

  fs.writeFileSync(`./pics/${author}.jpg`, Buffer.from(buffer));
}
