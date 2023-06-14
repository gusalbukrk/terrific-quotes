import fs from 'fs';
import puppeteer from 'puppeteer';

const quotes = JSON.parse(fs.readFileSync('goodreads-quotes.json', 'utf-8'));

for (const [author, link] of Object.entries(JSON.parse(fs.readFileSync('goodreads-links.json', 'utf-8')))) {
  if (link === null || author in quotes) continue;

  console.log(author);

  const browser = await puppeteer.launch({ headless: false, executablePath: '/opt/google/chrome/google-chrome' });
  const page = await browser.newPage();

  await page.goto(link, { timeout: 60000 });

  await page.setViewport({width: 1080, height: 1024});

  const qs = await page.evaluate(() => {
    const qs = [ ...document.querySelectorAll('.quotes .quote .quoteText') ].map(q => q.textContent.match(/(?<=“).*(?=”)/)[0]);

    return qs;
  });

  await browser.close();

  // console.log(qs);
  quotes[author] = qs;

  fs.writeFileSync('goodreads-quotes.json', JSON.stringify(quotes, null, 2));
}
