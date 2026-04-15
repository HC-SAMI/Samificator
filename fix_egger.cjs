const fs = require('fs');
const filename = 'egger.csv';
const content = fs.readFileSync(filename, 'utf-8');
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
    lines[i] = lines[i].replace(/,+$/, '');
}

fs.writeFileSync(filename, lines.join('\n'));
console.log('Updated egger.csv');
