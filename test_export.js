import fs from 'fs';
const appCode = fs.readFileSync('app.jsx', 'utf-8');
const indexHtml = fs.readFileSync('index.html', 'utf-8');
console.log("appCode length:", appCode.length);
console.log("indexHtml length:", indexHtml.length);
