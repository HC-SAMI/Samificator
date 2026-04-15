const http = require('http');

http.get('http://localhost:3000/pins.csv', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const fs = require('fs');
        fs.writeFileSync('pins.csv', data);
        console.log("Saved");
    });
}).on('error', (e) => {
    console.error(e);
});
