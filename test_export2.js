import fs from 'fs';
import { JSDOM } from 'jsdom';

const appCode = fs.readFileSync('app.jsx', 'utf-8');
const indexHtml = fs.readFileSync('index.html', 'utf-8');

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
    if (!el.type.includes('babel') && !el.innerHTML.includes('tailwind.config') && !el.src) el.remove(); 
    if (el.src && el.src.includes('app.jsx')) el.remove();
}); 

// Inline State
const stateScript = document.createElement('script'); 
stateScript.id = 'color-samificator-state'; 
stateScript.type = 'application/json'; // Changed to JSON for easier parsing
stateScript.textContent = JSON.stringify({ test: "data" }); 
clone.querySelector('head').appendChild(stateScript); 

// Inline App Code
const appScript = document.createElement('script');
appScript.type = 'text/babel';
appScript.setAttribute('data-compact', 'true');
appScript.textContent = appCode;
clone.querySelector('body').appendChild(appScript);

const htmlContent = "<!DOCTYPE html>\n" + clone.outerHTML; 
fs.writeFileSync('exported.html', htmlContent);
console.log("Exported successfully");
