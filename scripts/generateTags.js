import dotenv from 'dotenv';
import fs from 'fs';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  }),
);

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function createPrompt(quote) {
  return `You'll receive a quote and return an array of strings containing 3 to 5 tags that describe the essence and context of the quote.
  
  "I have a dream": ["hope", "aspiration", "future"]

  "${quote}": 
  `;
}

const graded = JSON.parse(fs.readFileSync('quotes-tags.json', 'utf8'));

for (const [author, quotes] of Object.entries(JSON.parse(fs.readFileSync('quotes-positive.json', 'utf8')))) {
  if (author in graded) continue;

  console.log(author);

  const qs = [];

  for (const [grade, quote] of quotes) {
    console.log(quote);

    const resp = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: createPrompt(quote),
      max_tokens: 256,
    });
    await wait(1000);

    const tags = JSON.parse(resp.data.choices[0].text);
    console.log(tags);

    qs.push([grade, quote, tags]);
  }

  graded[author] = qs;

  console.log('\n\n');
  fs.writeFileSync('quotes-tags.json', JSON.stringify(graded, null, 2));
}
