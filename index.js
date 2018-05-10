//const cluster = require('cluster');
const express = require('express');

const getScreenshot = require('./modules/screenshot');
const getOfacScreenshot = require('./modules/ofac');

//const numberOfWorkers = require('os').cpus().length;

// if (cluster.isMaster) {
// 	console.log('Master with %s workers', numberOfWorkers);

// 	for (let i = 0; i < numberOfWorkers; i += 1) {
// 		cluster.fork();
// 		// const worker = cluster.fork();
// 		// console.log('Worker %s started.', worker.pid);
// 	}

// 	cluster.on('exit', (worker) => {
// 		console.log('Worker %s died. restart...', worker.process.pid);
// 		cluster.fork();
// 	});
// } else {

const app = express();

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
			image: result.toString('base64')
		}));
	} catch (err) {
		console.log(err);
		res.end(JSON.stringify({ status: false, image: '' }));
	}
});

app.get('/ofac', async (req, res) => {
	try {
		console.log(`WorkerId: ${process.pid}`);

		const dbaname = req.query.dbaname;

		console.log(`WorkerId ${process.pid} dba start: ${dbaname}`);

		const result = await getOfacScreenshot(dbaname);

		console.log(`WorkerId ${process.pid} dba end: ${dbaname}`);

		res.contentType('application/json');

		res.send(JSON.stringify({
			status: true,
			image: result.toString('base64')
		}));

	} catch (err) {
		console.log(err);
		res.end(JSON.stringify({ status: false, image: '' }));
	}
});

app.listen(5001, () => console.log(`ID ${process.pid} Listening on port 5001`));
//}

process.on('uncaughtException', (err) => {
	console.log(err);
	process.exit(1);
});
