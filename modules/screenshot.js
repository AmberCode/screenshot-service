const puppeteer = require('puppeteer');

module.exports = async (url) => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	page.setViewport({ width: 1024, height: 768 });
	await page.goto(url, { timeout: 18000 });
	const result = await page.screenshot({ type: 'png', fullPage: true });
	await page.waitFor(500);
	await browser.close();

	return result;
};
