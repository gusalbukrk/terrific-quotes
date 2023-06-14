import fs from 'fs';
import puppeteer from 'puppeteer';

const links = JSON.parse(fs.readFileSync('goodreads-links.json', 'utf-8'));

for (const author of JSON.parse(fs.readFileSync('authors.json', 'utf-8'))) {
  if (author in links) continue;

  process.stdout.write(`${author}: `);

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('https://google.com');

  await page.setViewport({width: 1080, height: 1024});

  const search = await page.$('textarea[type="search"]');
  await search.type(`Quotes by ${author} site:goodreads.com`, { delay: 100 });
  await search.press('Enter');
  await page.waitForNavigation();

  const link = await page.$(`a[href^="https://www.goodreads.com/author/quotes/"][href$=${author.replace(/ |-/g, '_').replace(/[^A-z_]/g, '')}]`);

  if (link === null) {
    links[author] = null;
    console.log('❌');
  } else {
    links[author] = await (await link.getProperty('href')).jsonValue();
    console.log('✅');
  }

  await browser.close();

  fs.writeFileSync('goodreads-links.json', JSON.stringify(links, null, 2));
}
