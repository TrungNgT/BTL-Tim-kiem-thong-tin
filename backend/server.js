import express from "express";
import bodyParser from "body-parser";
import puppeteerScraper from "./puppeteerScraper";


const app = express();
app.use(bodyParser.json());

app.post('/scrape', async (req, res) => {
    try {
        const { url } = req.body;
        const data = await puppeteerScraper.scrape(url);
        await solrClient.indexDocument(data);
        res.status(200).send('Data scraped and indexed successfully');
    } catch (error) {
        res.status(500).send('Error occurred: ' + error.message);
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});