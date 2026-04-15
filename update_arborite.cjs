const fs = require('fs');
const puppeteer = require('puppeteer');
const { createCanvas, loadImage } = require('canvas');

async function processArborite() {
    const filename = 'arborite.csv';
    const content = fs.readFileSync(filename, 'utf-8');
    const lines = content.split('\n');
    let updated = false;

    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();

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
            const webLink = parts[3].replace(/"/g, '');
            let imageUrl = parts[4].replace(/"/g, '');
            let hex = parts[5].replace(/"/g, '');

            if (webLink && webLink.startsWith('http') && !imageUrl) {
                try {
                    console.log(`Fetching ${webLink}...`);
                    await page.goto(webLink, { waitUntil: 'domcontentloaded', timeout: 10000 });
                    
                    // Try to find og:image or product image
                    imageUrl = await page.evaluate(() => {
                        const ogImage = document.querySelector('meta[property="og:image"]');
                        if (ogImage) return ogImage.content;
                        const img = document.querySelector('.product-image-photo, .gallery-placeholder img');
                        if (img) return img.src;
                        return null;
                    });

                    if (imageUrl) {
                        console.log(`Found image: ${imageUrl}`);
                        parts[4] = `"${imageUrl}"`;
                        updated = true;
                    }
                } catch (e) {
                    console.error(`Failed to fetch ${webLink}: ${e.message}`);
                }
            }

            if ((hex === '#cccccc' || hex === '' || !hex) && imageUrl && imageUrl.startsWith('http')) {
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
                        updated = true;
                        console.log(`Updated ${parts[2]} to ${newHex}`);
                    }
                } catch (e) {
                    console.error(`Failed to process image for ${parts[2]}: ${e.message}`);
                }
            }
            
            lines[i] = parts.map(p => p.startsWith('"') ? p : `"${p}"`).join(',');
        }
    }

    await browser.close();

    if (updated) {
        fs.writeFileSync(filename, lines.join('\n'));
        console.log(`Saved updates to ${filename}`);
    }
}

processArborite();
