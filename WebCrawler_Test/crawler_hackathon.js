import { launch } from 'puppeteer';

async function getDivChildren() {
    // Launch a headless browser
    const browser = await launch();
    const page = await browser.newPage();

    // Go to the target URL
    await page.goto('https://www.brainyquote.com/authors');

    // Get the children of the div with the specific class
    const children = await page.$$eval('.bq_fl.indexContent.authorContent > *', elements => {
        return elements.map(element => element.outerHTML); // Collecting outer HTML of each child
    });

    // Log the children elements
    console.log(children);

    // Close the browser
    await browser.close();
}

getDivChildren();
