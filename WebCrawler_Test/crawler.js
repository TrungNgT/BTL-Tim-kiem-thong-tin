import puppeteer from 'puppeteer';
import fs from 'fs';

// URL của trang Vinmec với danh sách các bài viết
const baseURL = 'https://www.vinmec.com/vie/suc-khoe-tong-quat/';

// Hàm thu thập dữ liệu từ trang chủ
const scrapeHealthArticles = async () => {
    let browser;
    try {
        // Khởi chạy trình duyệt
        browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        const bulkData = []; // Chứa dữ liệu đầu ra theo định dạng Elasticsearch Bulk API

        // Duyệt qua các trang từ 1 đến 100
        for (let i = 701; i <= 800; i++) {
            const pageURL = `${baseURL}/page_${i}`;
            await page.goto(pageURL, { waitUntil: 'domcontentloaded', timeout: 0 });

            console.log(`Đang thu thập dữ liệu từ trang ${i}...`);

            // Lấy danh sách bài viết trên trang hiện tại
            const articles = await page.evaluate(() => {
                return [...document.querySelectorAll('.content_news_hor')].map(article => {
                    const titleElement = article.querySelector('.title_news_main');
                    const descElement = article.querySelector('.desc_news_main');
                    const link = titleElement ? `https://www.vinmec.com${titleElement.getAttribute('href')}` : null;
                    const title = titleElement ? titleElement.innerText.trim() : "Không có tiêu đề";
                    const description = descElement ? descElement.innerText.trim() : "Không có mô tả";
                    return { title, description, link };
                });
            });

            // Duyệt qua từng bài viết để lấy nội dung chi tiết
            for (const article of articles) {
                if (article.link) {
                    await page.goto(article.link, { waitUntil: 'domcontentloaded', timeout: 0 });
                    try {
                        // Chờ phần tử chứa nội dung bài viết xuất hiện
                        await page.waitForSelector('#main-article', { timeout: 20000 });

                        // Thu thập nội dung bài viết
                        const content = await page.evaluate(() => {
                            const contentElement = document.querySelector('#main-article');
                            return contentElement ? contentElement.innerText.trim() : "Không có nội dung";
                        });

                        // Thêm nội dung vào dữ liệu bài viết
                        article.content = content;

                        // Tạo cặp dòng cho Bulk API
                        bulkData.push(
                            { index: { _index: 'healthsearch' } },  // Sẽ tạo thêm 1 index là healthsearch
                            { title: article.title, description: article.description, link: article.link, content: article.content }
                        );
                    } catch (error) {
                        console.error(`Lỗi khi thu thập nội dung từ bài viết ${article.link}:`, error);
                    }
                }
            }
        }

        // Ghi dữ liệu vào tệp JSON theo định dạng Bulk API
        fs.writeFileSync('elastic_bulk_health_articles701_800.json', JSON.stringify(bulkData, null, 2));
        console.log("Đã lưu dữ liệu chi tiết vào elastic_bulk_health_articles.json");
    } catch (error) {
        console.error("Lỗi khi thu thập dữ liệu:", error);
    } finally {
        if (browser) await browser.close();
    }
};

// Gọi hàm để bắt đầu thu thập dữ liệu
scrapeHealthArticles();
