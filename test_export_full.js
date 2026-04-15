import fs from 'fs';
import { JSDOM } from 'jsdom';

const appCode = fs.readFileSync('app.jsx', 'utf-8');
const indexHtml = fs.readFileSync('index.html', 'utf-8');
const munsellCode = fs.readFileSync('munsell-browser.js', 'utf-8');
const colorDataCode = fs.readFileSync('color-data.json', 'utf-8');

const dom = new JSDOM(indexHtml);
const document = dom.window.document;

const clone = document.documentElement.cloneNode(true); 
const root = clone.querySelector('#root'); 
if (root) root.innerHTML = ''; 

// Remove existing state and scripts
const oldState = clone.querySelector('#color-samificator-state'); 
if (oldState) oldState.remove(); 
const oldConfig = clone.querySelector('#color-samificator-config');
if (oldConfig) oldConfig.remove();

clone.querySelectorAll('script').forEach(el => { 
    if (el.type === 'text/babel') { el.remove(); return; }
    if (el.src && el.src.includes('app.jsx')) { el.remove(); return; }
    if (el.src && el.src.includes('munsell-browser.js') && munsellCode) {
        const inlineMunsell = document.createElement('script');
        inlineMunsell.id = 'munsell-browser-inline';
        inlineMunsell.textContent = munsellCode;
        el.replaceWith(inlineMunsell);
        return;
    }
    
    // Remove unrecognized inline scripts (injected by extensions)
    if (!el.src && 
        !el.innerHTML.includes('tailwind.config') && 
        el.id !== 'color-samificator-state' && 
        el.id !== 'color-samificator-data' &&
        el.id !== 'munsell-browser-inline') {
        el.remove();
    }
}); 

// Inline State
const stateScript = document.createElement('script'); 
stateScript.id = 'color-samificator-state'; 
stateScript.type = 'application/json';
stateScript.textContent = JSON.stringify({ test: "data" }); 
clone.querySelector('head').appendChild(stateScript); 

if (colorDataCode) {
    const oldColorData = clone.querySelector('#color-samificator-data');
    if (oldColorData) oldColorData.remove();
    const colorDataScript = document.createElement('script');
    colorDataScript.id = 'color-samificator-data';
    colorDataScript.textContent = `window.__COLOR_DATA__ = ${colorDataCode};`;
    clone.querySelector('head').appendChild(colorDataScript);
}

// Inline App Code
const appScript = document.createElement('script');
appScript.type = 'text/babel';
appScript.setAttribute('data-compact', 'true');
appScript.textContent = appCode;
clone.querySelector('body').appendChild(appScript);

const htmlContent = "<!DOCTYPE html>\n" + clone.outerHTML; 
fs.writeFileSync('exported_full.html', htmlContent);
console.log("Exported successfully");
