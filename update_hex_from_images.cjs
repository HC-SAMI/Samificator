const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

async function processCSV(filename) {
    if (!fs.existsSync(filename)) return;
    const content = fs.readFileSync(filename, 'utf-8');
    const lines = content.split('\n');
    let updated = false;

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const parts = [];
        let current = '';
        let inQuotes = false;
        for (let j = 0; j < line.length; j++) {
            const char = line[j];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                parts.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        parts.push(current);

        if (parts.length >= 6) {
            const hex = parts[5].replace(/"/g, '');
            const imageUrl = parts[4].replace(/"/g, '');

            if ((hex === '#cccccc' || hex === '') && imageUrl && imageUrl.startsWith('http')) {
                try {
                    console.log(`Processing image for ${parts[2]}: ${imageUrl}`);
                    const image = await loadImage(imageUrl);
                    
                    const canvas = createCanvas(image.width, image.height);
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(image, 0, 0);
                    
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const data = imageData.data;
                    
                    let rTotal = 0, gTotal = 0, bTotal = 0, count = 0;
                    
                    for (let k = 0; k < data.length; k += 4) {
                        rTotal += data[k];
                        gTotal += data[k + 1];
                        bTotal += data[k + 2];
                        count++;
                    }

                    if (count > 0) {
                        const r = Math.round(rTotal / count);
                        const g = Math.round(gTotal / count);
                        const b = Math.round(bTotal / count);
                        
                        const newHex = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
                        parts[5] = `"${newHex}"`;
                        lines[i] = parts.map(p => p.startsWith('"') ? p : `"${p}"`).join(',');
                        updated = true;
                        console.log(`Updated ${parts[2]} to ${newHex}`);
                    }
                } catch (e) {
                    console.error(`Failed to process image for ${parts[2]}: ${e.message}`);
                }
            }
        }
    }

    if (updated) {
        fs.writeFileSync(filename, lines.join('\n'));
        console.log(`Saved updates to ${filename}`);
    }
}

async function main() {
    const files = fs.readdirSync('.').filter(f => f.endsWith('.csv'));
    for (const file of files) {
        console.log(`Checking ${file}...`);
        await processCSV(file);
    }
}

main();
