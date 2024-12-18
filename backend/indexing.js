import data from '../docs/collection.json' assert { type: 'json' };
import client from './server.js';

await client.indices.create({ 
  index: "vietnamese_vinmec_doc",
  settings: {
    number_of_shards: 1,
    analysis: {
      analyzer: {
        my_vi_analyzer: {
          type: "custom",
          tokenizer: "vi_tokenizer",
          filter: [
            "lowercase",
            "ascii_folding",
            "vietnamese_stops"
          ]
        }
      },
      filter: {
        ascii_folding: {
          type: "asciifolding",
          preserve_original: true
        },
        vietnamese_stops: {
          type: "stop",
          stopwords: ['và', 'những', 'đã', 'rất']
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

client.info().then(console.log, console.log)


const numb = data.length

for (let i = 0; i < numb; ++i) {
    const doc = data[i]
    console.log(doc["title"])
    await client.index({
      index: "vietnamese_vinmec_doc",
      document: doc
    })
}