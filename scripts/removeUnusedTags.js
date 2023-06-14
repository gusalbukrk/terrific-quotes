import fs from 'fs';

const db = JSON.parse(fs.readFileSync('./db.json', 'utf8'));
let tags = JSON.parse(fs.readFileSync('./tags.json', 'utf8'));

const uniqueTags = Array.from(new Set(db.quotes.map(q => q[3]).flat()));

tags = tags.filter(tag => uniqueTags.includes(tag)); 

fs.writeFileSync('./tags.json', JSON.stringify(tags, null, 2));