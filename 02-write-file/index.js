const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filePath = path.join(__dirname, 'output.txt');

const writeStream = fs.createWriteStream(filePath, { flags: 'a' });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('Enter some text. Type "exit" or press Ctrl+C to quit.');

rl.on('line', (input) => {
  if (input.trim().toLowerCase() === 'exit') {
    console.log('Goodbye!');
    rl.close();
  } else {
    writeStream.write(`${input}\n`, (err) => {
      if (err) console.error('Error writing to file:', err.message);
    });
  }
});

process.on('SIGINT', () => {
  console.log('\nGoodbye!');
  rl.close();
});

rl.on('close', () => {
  writeStream.end();
});
