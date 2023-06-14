import dotenv from 'dotenv';
import fs from 'fs';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  }),
);

function createPrompt(name) {
  return `Given the name of a person universally held as evil you'll return a concise biographical sentence listing the 2 to 3 most heinous and destructive things done by that individual. The biographical sentences must contain extremely loaded negative terms, mustn't contain the person's name and must start with "known for".
  
  ${name}: 
  `;
}

function trimAnswer(answer) {
  return answer.trim().replace(/^"|"$/g, '').replace(/^known for /i, '').replace(/\.$/, '');
}

const bios = JSON.parse(fs.readFileSync('bios.json', 'utf8'));

for (const name of JSON.parse(fs.readFileSync('authors.json', 'utf8'))) {
  if (name in bios) continue;

  console.log(`${name}`);

  try {
    const resp = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: createPrompt(name),
      max_tokens: 256,
      n: 3,
    });

    const choices = resp.data.choices.map(c => trimAnswer(c.text));

    console.log(choices);
    bios[name] = choices;
  } catch (e) {
    console.error(e);
    break;
  }

  console.log('\n\n');
}

fs.writeFileSync('bios.json', JSON.stringify(bios, null, 2));
