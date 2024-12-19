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
console.log(synList.length)

// ------------------------------------------------------------------------------------------------

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

console.log(client.info())