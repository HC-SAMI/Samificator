const fs = require('fs');

const hexMap = {
    'Saguenay': '#D3D3D3',
    'Sand': '#C2B280',
    'S575 Ultra White': '#FFFFFF',
    'S578 Portobello': '#8B8178',
    'S579 Suede': '#A08C73',
    'S582 Tangelo': '#F94D00',
    'S576 Galena': '#808080',
    'S577 Graphite': '#383838',
    'S584 Amaranth': '#E52B50',
    'S583 Fern': '#4F7942',
    'S581 Jasper': '#D73B3E',
    'S580 Garnet': '#733635',
    'Midnight Blue': '#191970',
    'Elegant White': '#F5F5F5',
    'Custom Grey': '#808080',
    'Limousine Grey': '#555555',
    'Denim Blue': '#1560BD',
    'Cordova Brown': '#6B4423',
    'Fire Red': '#CE2029',
    'Ultramarine': '#120A8F',
    'Beige': '#F5F5DC'
};

const filename = 'arborite.csv';
const content = fs.readFileSync(filename, 'utf-8');
const lines = content.split('\n');

for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const parts = line.split('","');
    if (parts.length >= 6) {
        let name = parts[2].replace(/"/g, '');
        if (hexMap[name]) {
            parts[5] = hexMap[name] + '"';
            lines[i] = parts.join('","');
        }
    }
}

fs.writeFileSync(filename, lines.join('\n'));
console.log('Updated arborite.csv');
