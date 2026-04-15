import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.static(__dirname, { index: false }));

app.use(express.json());

app.get('*', (req, res) => {
  let html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
  res.send(html);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
