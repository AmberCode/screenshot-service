
const app = require('express')();
const puppeteer = require('puppeteer');

async function getScreenshot(url) {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.setViewport({ width: 1024, height: 768 });
    await page.goto(url, {timeout: 18000} );
    const result = await page.screenshot({ type: 'png', fullPage: true });
    await page.waitFor(500);
    await browser.close();

    return result;
}

process.on('uncaughtException', (err) => {
    console.log(err);
    process.exit(1);
});

app.get('/screenshot', async (req, res) => {

    try {
        const result = await getScreenshot(req.query.url);

        res.writeHead(200, { 
            'content-type': 'image/png'
        });

        res.end(result, 'binary');
        
    } catch (error) {
        res.end('', 'binary');    
    }
});

app.listen(3000, () => console.log('Listening on port 3000'));




