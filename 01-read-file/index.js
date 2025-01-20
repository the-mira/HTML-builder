const fs = require('fs');
const path = require('path');

const { stdout } = process;

const filePath = path.join(__dirname, 'text.txt');

const readStream = fs.createReadStream(filePath, { encoding: 'utf-8' });

readStream.on('data', (data) => stdout.write(data));

readStream.on('error', (err) => console.error(err));

readStream.on('end', () => stdout.write('\n'));
