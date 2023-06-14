import fs from 'fs';
import puppeteer from 'puppeteer';

const azquotes = JSON.parse(fs.readFileSync('azquotes.json', 'utf-8'));
const db = JSON.parse(fs.readFileSync('db.json', 'utf-8'));

// for (let [, authorName] of [[0, 'Adolf Eichmann']]) {
for (let [, authorName] of db.authors) {
  if (authorName in azquotes) continue;

  // only 1 of 3 authors with accented letters, only which actually have quotes on BrainyQuotes
  if (authorName === 'Hồ Chí Minh') authorName = 'Ho Chi Minh';

  azquotes[authorName] = [];

  process.stdout.write(`${authorName}: `);

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(`https://www.azquotes.com/search_results.html?query=${authorName}`);

  await page.setViewport({width: 1080, height: 1024});

  const quotes = await page.$$eval('a[href^="/quote/"]:not(:has(img))', qs => qs.map(q => q.textContent.trim()));

  console.log(quotes.length === 0 ? '❌' : '✅');

  azquotes[authorName] = quotes;
  fs.writeFileSync('azquotes.json', JSON.stringify(azquotes, null, 2));

  await browser.close();
}
