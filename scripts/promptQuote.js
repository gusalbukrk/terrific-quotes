import fs from 'fs';
import inquirer from 'inquirer';

const prompt = JSON.parse(fs.readFileSync('./prompt.json', 'utf8'));
const db = JSON.parse(fs.readFileSync('./db.json', 'utf8'));

for (const [ index, [authorID, , quote, tags] ] of Object.entries(db.quotes).slice(prompt.length)) {
  const author = db.authors.find(([id, name, bios]) => id === authorID);
  const [, authorName, bios] = author;

  // const { answer } = await inquirer.prompt([{ name: 'answer', message: `${quote} \n- ${authorName} \n${bios.map(b => `    ${b}`).join('\n')}\n${tags.join(', ')}\n`, type: 'confirm' }]);
  const { answer } = await inquirer.prompt([{ name: 'answer', message: `${quote} - ${authorName}`, type: 'confirm' }]);

  prompt[index] = answer;
  fs.writeFileSync('./prompt.json', JSON.stringify(prompt, null, 2));

  console.log();
}