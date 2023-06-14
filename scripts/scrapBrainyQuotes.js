import fs from 'fs';
import puppeteer from 'puppeteer';

const bq = JSON.parse(fs.readFileSync('brainyquotes.json', 'utf-8'));
const db = JSON.parse(fs.readFileSync('db.json', 'utf-8'));

for (let [, authorName] of db.authors) {
// for (let [, authorName] of [[0, 'Adolf Hitler']]) {
  if (authorName in bq) continue;

  // only 1 of 3 authors with accented letters, only which actually have quotes on BrainyQuotes
  if (authorName === 'Hồ Chí Minh') authorName = 'Ho Chi Minh';

  bq[authorName] = [];

  process.stdout.write(`${authorName}: `);

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(`https://www.brainyquote.com/search_results?q=${authorName}`);

  await page.setViewport({width: 1080, height: 1024});

  const a = await page.$('.qb a.bq-aut');

  // if author has quotes on BrainyQuotes
  if (a !== null && await (await a.getProperty('textContent')).jsonValue() === authorName) {
    const href = await (await a.getProperty('href')).jsonValue();
    await page.goto(href);

    const quotes = await page.$$eval('.qb .b-qt', qs => qs.map(q => q.textContent.trim()));

    bq[authorName] = quotes;
    
    console.log('✅');
  } else console.log('❌');

  fs.writeFileSync('brainyquotes.json', JSON.stringify(bq, null, 2));

  await browser.close();
}
