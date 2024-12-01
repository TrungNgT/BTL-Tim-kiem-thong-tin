import express from 'express';
import { Client } from '@elastic/elasticsearch';
import cors from 'cors';
import fs from 'fs';

const app = express();
app.use(cors());

// Cấu hình client Elasticsearch
const client = new Client({
    node: 'https://localhost:9200',
    auth: {
        username: 'elastic',
        password: "paste mật khẩu elastic vào đây",
    },
    tls: {
        requestCert: true,
        ca: fs.readFileSync("Đường link trỏ tới thư mục elasticseasted" + '/configs/certs/http_ca.crt'),
        rejectUnauthorized: true,
    }
});

const run = async () => {
    try {
        await client.indices.exists({
            index: 'healthsearch'
        });
        return true;
    } catch (error) {
        console.error('Error:', error);
    }
};

run().catch(console.log);


// Route để xử lý tìm kiếm
app.get('/api/search', async (req, res) => {
  const query = req.query.query || ''; // Lấy từ khóa tìm kiếm từ query param

  if (!query) {
    return res.status(400).json({ message: 'No search term provided' });
  }

  try {
    // Gửi truy vấn tới Elasticsearch
    const { body } = await client.search({
      index: 'healthsearch', // Tên index trong Elasticsearch
      body: {
        query: {
          query_string: {
            query: query,  // Từ khóa hoặc chuỗi truy vấn
            fields: ["title", "description", "content"]  // Liệt kê các trường cần tìm kiếm (trừ link)
          }
        },
        highlight: {
          fields: {
            content: {
              fragment_size: 150, // Độ dài mỗi đoạn highlight
              number_of_fragments: 3, // Số đoạn tối đa
            },
          },
        },
      },
    });
    console.log(body);
    // Trả về danh sách kết quả (hits)
    const results = body.hits.hits.map((hit) => ({
      title: hit._source.title,
      description: hit._source.description,
      link: hit._source.link,
      content: hit.highlight?.content?.join(' ') || hit._source.content.substring(0, 200) + '...',
    }));

    res.json(results);
  } catch (err) {
    console.error('Elasticsearch query error:', err);
    res.status(500).json({ message: 'Error querying Elasticsearch' });
  }
});

// Khởi chạy server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
