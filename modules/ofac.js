const puppeteer = require('puppeteer');

module.exports = async (dbaname) => {
	console.log('launch...');
	const browser = await puppeteer.launch({
		ignoreHTTPSErrors: true,
		args: ['--no-sandbox', '--headless', '--disable-gpu', '--disable-dev-shm-usage', '--start-maximized']
	});

	console.log('newPage...');
	const page = await browser.newPage();
	//await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36');


	await page.setExtraHTTPHeaders(
		{
			'Host': 'www.instantofac.com',
			'Referer': 'http://www.instantofac.com/search.php',
			'Content-Type': 'application/x-www-form-urlencoded'
		});

	await page.setRequestInterception(true);

	page.on('request', (interceptedRequest) => {

		var data = {
			'method': 'POST',
			'postData': `input_string=${dbaname}&sensitivity=.6`
		};

		// Request modified... finish sending!
		interceptedRequest.continue(data);
	});

	console.log('goto...');

	await page.goto('http://www.instantofac.com/search.php', {
		waitUntil: 'load',
		timeout: 60000
	});
	// const bodyHandle = await page.$('body');
	// const { width, height } = await bodyHandle.boundingBox();
	console.log('setViewport...');
	await page.setViewport({ width: 1920, height: 1024 });

	console.log('screenshot...');
	const result = await page.screenshot();

	console.log('close...');
	await browser.close();

	console.log('return...');
	return result;
};
