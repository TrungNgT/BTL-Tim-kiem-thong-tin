const puppeteer = require('puppeteer');

async function scrape(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://google.com");

    // Giả định rằng dữ liệu y tế nằm trong một số thẻ cụ thể
    const data = await page.evaluate(() => {
        // Ví dụ thu thập tiêu đề và nội dung
        return {
            title: document.querySelector('h1').innerText,
            content: document.querySelector('.content').innerText
        };
    });

    await browser.close();
    return data;
}

module.exports = { scrape };