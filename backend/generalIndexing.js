import { readdirSync } from 'fs';

// Specify the folder path
const folderPath = '../generalDocs/';

let files = []

try {
  // Read the directory synchronously
    files = readdirSync(folderPath);
} catch (err) {
  console.error('Error reading directory:', err);
}

// console.log(files)

// -----------------------------------------------------------------------------------------------
import synList from './synonyms.json' assert { type: 'json' };
// synList is an array in JavaScript after the import, not a raw JSON string.
//console.log(synList)

// ------------------------------------------------------------------------------------------------
/*
import client from './server.js';

await client.indices.create({ 
    index: "general_with_synonyms",
    settings: {
      number_of_shards: 1,
      analysis: {
        analyzer: {
          my_vi_analyzer: {
            type: "custom",
            tokenizer: "vi_tokenizer",
            filter: [
              "lowercase",
              "vietnamese_stops",
              "vietnamese_synonyms"
            ]
          }
        },
        filter: {
          vietnamese_stops: {
            type: "stop",
            stopwords: ['và', 'những', 'đã', 'rất']
          },
          vietnamese_synonyms: {
            type: "synonym",
            synonyms: synList
          }
        }
      }
    },
    mappings: {
      properties: {
        content: {
          type: "text",
          analyzer: "my_vi_analyzer",
          search_analyzer: "my_vi_analyzer"
        },
        link: {
          type: "text",
          analyzer: "standard",
          search_analyzer: "standard"   // standard to remove '/' but to remove '-' need to use filter with type: "pattern_replace"
        },
        description: {
          type: "text",
          analyzer: "my_vi_analyzer",
          search_analyzer: "my_vi_analyzer"
        },
        title: {
          type: "text",
          analyzer: "my_vi_analyzer",
          search_analyzer: "my_vi_analyzer"
        }
      }
    }
  });

//console.log(client.info())
*/
// ------------------------------------------------------------------------------------------------

import fs from 'fs';
import { Client } from '@elastic/elasticsearch';

const client = new Client({
    node: 'http://localhost:9200',
    auth: {
        username: 'elastic',
        password: "FokPpOKqXaEC+ItgCdKQ",
    },
    
    // tls: {
    //     requestCert: true,
    //     ca: fs.readFileSync("D:/elasticsearch-8.15.2-windows-x86_64/elasticsearch-8.15.2/config/certs/http_ca.crt"),
    //     rejectUnauthorized: false,
    // }
});

for (let f of files) {
  const filepath = folderPath + f;

  if (f === 'vinmec.json') {
    const datastring = fs.readFileSync(filepath, 'utf-8');
    const jsonData = JSON.parse(datastring);

    const numb = jsonData.length

    for (let i = 0; i < numb; ++i) {
      const doc = jsonData[i]
      console.log(doc["title"])
      await client.index({
        index: "general_with_synonyms",
        document: doc
      });
    }
    continue;
  }

  const datastring = fs.readFileSync(filepath, 'utf-8');
  const jsonData = JSON.parse(datastring);
  
  const docslen = jsonData.length;
  console.log(docslen);

  for (let doc of jsonData) {
    let longestField = '';
    let noSpaceField = '';
    let shortestFields = ['', ''];

    for (let key in doc) {
      if (key.length > longestField.length) {
        longestField = key;
      }
      if (!key.includes(' ') && typeof doc[key] === 'string' && (doc[key].startsWith('http') || doc[key].startsWith('https'))) {
        noSpaceField = key;
      }
      if (shortestFields[0] === '' || key.length < shortestFields[0].length) {
        shortestFields[1] = shortestFields[0];
        shortestFields[0] = key;
      } else if (shortestFields[1] === '' || key.length < shortestFields[1].length) {
        shortestFields[1] = key;
      }
    }

    // Ensure the two shortest fields are different from the noSpaceField
    if (shortestFields[0] === noSpaceField) {
      shortestFields[0] = shortestFields[1];
    }
    if (shortestFields[1] === noSpaceField) {
      shortestFields[1] = '';
      for (let key in doc) {
        if (key !== noSpaceField && key.length < shortestFields[0].length) {
          shortestFields[1] = key;
        }
      }
    }

    const newDoc = {
      content: doc[longestField],
      link: doc[noSpaceField],
      description: doc[shortestFields[0]] + ' ' + doc[shortestFields[1]],
      title: ''
    };
    newDoc.title = newDoc.description.split(' ').slice(0, 15).join(' ');

    // Replace the old document with the new one
    Object.keys(doc).forEach(key => delete doc[key]);
    Object.assign(doc, newDoc);

    client.index({
      index: "general_with_synonyms",
      document: doc
    });
  }
}