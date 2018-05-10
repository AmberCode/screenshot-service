const puppeteer = require('puppeteer');

module.exports = async (url) => {
	console.log('launch...');
	const browser = await puppeteer.launch({
		ignoreHTTPSErrors: true,
		args: ['--no-sandbox', '--headless', '--disable-gpu', '--disable-dev-shm-usage', '--start-maximized']
	});

	console.log('newPage...');
	const page = await browser.newPage();
	await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36');

	console.log('goto...');

	await page.goto(url, {
		waitUntil: 'load',
		timeout: 60000
	});

	// const bodyHandle = await page.$('body');
	// const { width, height } = await bodyHandle.boundingBox();
	console.log('setViewport...');
	await page.setViewport({ width: 1920, height: 1024 });

	console.log('screenshot...');
	const result = await page.screenshot({fullPage: true});
	// const result = await page.screenshot({
	// 	clip: {
	// 		x: 0,
	// 		y: 0,
	// 		width,
	// 		height
	// 	},
	// 	type: 'png'
	// });


	//await bodyHandle.dispose();

	console.log('close...');
	await browser.close();

	console.log('return...');
	return result;
};
