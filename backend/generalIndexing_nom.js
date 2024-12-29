import { readdirSync } from 'fs';

// Specify the folder path
const folderPath = '../normalized_docs/';

let files = []

try {
  // Read the directory synchronously
  files = readdirSync(folderPath);
} catch (err) {
  console.error('Error reading directory:', err);
}


import synList from './synonyms.json' assert { type: 'json' };
// synList is an array in JavaScript after the import, not a raw JSON string.


import fs from 'fs';
import { Client } from '@elastic/elasticsearch';

const client = new Client({
  node: 'http://localhost:9200',
  auth: {
    username: 'elastic',
    password: "FokPpOKqXaEC+ItgCdKQ",
  },
});

await client.indices.create({
  index: 'general_indexing',
  settings: {
    number_of_shards: 1,
    analysis: {
      analyzer: {
        my_vi_analyzer: {
          type: 'custom',
          tokenizer: 'vi_tokenizer',
          filter: [
            "lowercase",
            "vietnamese_synonyms"
          ]
        }
      },
      filter: {
        vietnamese_synonyms: {
          type: "synonym",
          synonyms: synList
        }
      }
    },
  },
  mappings: {
    properties: {
      title: {
        type: "text",
        analyzer: "my_vi_analyzer",
        search_analyzer: "my_vi_analyzer"
      },
      link: {
        type: "text",
        analyzer: "standard",
        search_analyzer: "standard"
      },
      content: {
        type: "text",
        analyzer: "my_vi_analyzer",
        search_analyzer: "my_vi_analyzer"
      },
    },
  },
});

for (let f of files) {
  const filepath = folderPath + f;
  const datastring = fs.readFileSync(filepath, 'utf-8');
  const jsonData = JSON.parse(datastring);
  const numb = jsonData.length

  for (let i = 0; i < numb; ++i) {
    const doc = jsonData[i]
    console.log(doc["title"])
    await client.index({
      index: "general_indexing",
      document: doc
    });
  }
}