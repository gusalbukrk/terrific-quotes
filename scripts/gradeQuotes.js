import dotenv from 'dotenv';
import fs from 'fs';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  }),
);

// wait function
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function createPrompt(quote) {
  return `Rank the positivity of a quote from 1 to 10, with 10 being the most positive and 1 being the least positive.

  "${quote}":

  `;
}

const graded = JSON.parse(fs.readFileSync('quotes-graded.json', 'utf8'));

for (const [author, quotes] of Object.entries(JSON.parse(fs.readFileSync('quotes.json', 'utf8')))) {
  if (author in graded) continue;

  console.log(author);

  const qs = [];

  for (const quote of quotes) {
    console.log(quote);

    const n = 5;

    const resp = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: createPrompt(quote),
      max_tokens: 256,
      n,
    });
    await wait(1000);

    const avg = Math.round(resp.data.choices.reduce((acc, cur) => acc + parseInt(cur.text.trim(), 10), 0) / n);
    console.log(resp.data.choices.map((c) => c.text.trim()), avg);

    qs.push([avg, quote]);
  }

  graded[author] = qs;

  console.log('\n\n');
  fs.writeFileSync('quotes-graded.json', JSON.stringify(graded, null, 2));
}
