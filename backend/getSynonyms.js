import { createReadStream } from 'fs';
import { createInterface } from 'readline';
import fs from 'fs';

const filePath = './synonyms.txt';  // Path to your text file

let syn_list = []

const rl = createInterface({
  input: createReadStream(filePath),
  output: process.stdout,  // Optional: Direct output to stdout
  terminal: false
});

rl.on('line', (line) => {
  //console.log('Line:', line);  // Process each line here
  syn_list.push(line)
});

rl.on('close', () => {
  console.log('Finished reading the file.');
  const jsonString = JSON.stringify(syn_list)
  fs.writeFileSync('synonyms.json', jsonString, 'utf8')
  //console.log(syn_list);
});

