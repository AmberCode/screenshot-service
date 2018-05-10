const cluster = require('cluster');
const app = require('express')();
const getScreenshot = require('./modules/screenshot');
const numberOfWorkers = require('os').cpus().length;

if (cluster.isMaster) {
	console.log('Master with %s workers', numberOfWorkers);

	for (let i = 0; i < numberOfWorkers; i += 1) {
		const worker = cluster.fork().process;
		console.log('Worker %s started.', worker.pid);
	}

	cluster.on('exit', (worker) => {
		console.log('Worker %s died. restart...', worker.process.pid);
		cluster.fork();
	});
} else {
	app.get('/screenshot', async (req, res) => {
		try {
			console.log(`WorkerId: ${process.pid}`);

			const url = req.query.url;

			console.log(`WorkerId ${process.pid} Url start: ${url}`);

			const result = await getScreenshot(url);

			console.log(`WorkerId ${process.pid} Url end: ${url}`);

			res.contentType('application/json');

			res.send(JSON.stringify({
				status: true,
				image: result.toString('base64'),
			}));
		} catch (err) {
			console.log(err);
			res.end(JSON.stringify({ status: false, image: '' }));
		}
	});

	app.listen(5001, () => console.log('Listening on port 5001'));
}

process.on('uncaughtException', (err) => {
	console.log(err);
	process.exit(1);
});
