import fs from 'fs';

fs.writeFileSync('../src/db.json', JSON.stringify(JSON.parse(fs.readFileSync('./db.json', 'utf8'))));
