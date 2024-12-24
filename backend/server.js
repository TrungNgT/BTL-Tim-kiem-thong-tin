import express from 'express';
import { Client } from '@elastic/elasticsearch';
import cors from 'cors';
import fs from 'fs';

const app = express();
app.use(cors());

// Cấu hình client Elasticsearch
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

export default client;

const run = async () => {
    try {
        await client.indices.exists({
            index: "general_with_synonyms"
        });
        return true;
    } catch (error) {
        console.error('Error:', error);
    }
};

run().catch(console.log);


// Route để xử lý tìm kiếm
app.get('/api/search', async (req, res) => {
  const query = req.query.query || ''; // Get search keyword from query parameters

  if (!query) {
    return res.status(400).json({ message: 'No search term provided' });
  }

  try {
    // Query Elasticsearch
    const response = await client.search({
      index: "general_with_synonyms", // Elasticsearch index name
      body: {
        query: {
          query_string: {
            query: query,  // Search query
            fields: ["title", "description", "content"]  // Fields to search (excluding "link")
          }
        },
        highlight: {
          fields: {
            content: {
              fragment_size: 150, // Length of each highlight fragment
              number_of_fragments: 3, // Maximum number of fragments
            },
          },
        },
      },
    });

    console.log(JSON.stringify(response, null, 2));

    // Process results
    const results = response.hits.hits.map((hit) => ({
      title: hit._source.title,
      description: hit._source.description,
      link: hit._source.link,
      content: hit.highlight?.content
        ?.map(fragment => fragment.replace(/<em>/g, '').replace(/<\/em>/g, '')) // Remove <em> tags
        .join(' ') || hit._source.content.substring(0, 200) + '...', // Fallback content
    }));

    res.json(results);
  } catch (err) {
    console.error('Elasticsearch query error:', err);
    res.status(500).json({ message: 'Error querying Elasticsearch' });
  }
});

// Khởi chạy server
const PORT = 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
