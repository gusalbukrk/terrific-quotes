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
  return `You'll receive a quote and select up to 5 tags from the allowed tags list which best capture the essence of the quote. Answer in CSV.

  Allowed tags: ambition, communication, community, compassion, compromise, connection, cooperation, courage, creativity, democracy, determination, diversity, education, empathy, empowerment, environmentalism, equality, faith, freedom, friendship, government, health, honesty, human rights, improvement, individualism, inspiration, integrity, integrity, justice, knowledge, love, moderation, morality, motivation, nature, opportunity, peace, progress, respect, responsibility, society, strength, success, tolerance, trust, truth, unity.
  
  Quote: "${quote}"

  Tags:
  `;
}

const db = JSON.parse(fs.readFileSync('./db.json', 'utf8'));

for (let i = 0; i < db.quotes.length; i++) {
  const quote = db.quotes[i];

  if (quote.length === 4) continue;

  const resp = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: createPrompt(quote[2]),
    max_tokens: 256,
    n: 5,
  });
  await wait(1000);

  // console.dir(resp, { depth: null });

  const tags = resp.data.choices.map((c) => c.text);

  console.log(quote[2]);
  console.log(tags);

  quote.push(tags);
  fs.writeFileSync('./db.json', JSON.stringify(db, null, 2));
}
