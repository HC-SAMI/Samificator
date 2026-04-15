import fs from 'fs';
import { JSDOM } from 'jsdom';

const html = fs.readFileSync('exported_full.html', 'utf-8');
const dom = new JSDOM(html, { runScripts: "dangerously", resources: "usable" });

dom.window.onerror = function(msg, url, line, col, error) {
    console.error("Error in exported HTML:", msg, line, col);
};

setTimeout(() => {
    console.log("Root innerHTML length:", dom.window.document.getElementById('root').innerHTML.length);
}, 5000);
