import fs from 'fs';

const prompt = JSON.parse(fs.readFileSync('./prompt.json', 'utf8'));
const db = JSON.parse(fs.readFileSync('./db.json', 'utf8'));

db.quotes = db.quotes.filter((quote, index) => prompt[index]);

fs.writeFileSync('./db.json', JSON.stringify(db, null, 2));