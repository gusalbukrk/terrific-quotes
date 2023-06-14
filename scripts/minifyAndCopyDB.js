import fs from 'fs';

fs.writeFileSync('../src/db.min.json', JSON.stringify(JSON.parse(fs.readFileSync('./db.json', 'utf8'))));
