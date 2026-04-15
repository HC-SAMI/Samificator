const munsell = require('munsell');
const fs = require('fs');

const hues = ['R', 'YR', 'Y', 'GY', 'G', 'BG', 'B', 'PB', 'P', 'RP'];
const hueSteps = [2.5, 5, 7.5, 10];
const values = [2, 3, 4, 5, 6, 7, 8, 9];
const chromas = [2, 4, 6, 8, 10, 12, 14, 16];

const rows = [['Type', 'Adjective', 'Noun', 'ERP_Code', 'Note', 'HEX']];

for (const h of hues) {
    for (const step of hueSteps) {
        const hue = `${step}${h}`;
        for (const v of values) {
            for (const c of chromas) {
                const munsellCode = `${hue} ${v}/${c}`;
                try {
                    const hex = munsell.munsellToHex(munsellCode);
                    if (hex) {
                        rows.push(['DB', 'munsell', munsellCode, '', '', hex]);
                    }
                } catch (e) {
                    // Some combinations might not be valid in sRGB
                }
            }
        }
    }
}

// Add Neutrals
for (let v = 0; v <= 10; v += 0.5) {
    const munsellCode = `N ${v}`;
    try {
        const hex = munsell.munsellToHex(munsellCode);
        if (hex) {
            rows.push(['DB', 'munsell', munsellCode, '', '', hex]);
        }
    } catch (e) {}
}

const csvContent = rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
fs.writeFileSync('munsell.csv', csvContent);
console.log(`Generated munsell.csv with ${rows.length - 1} colors.`);
