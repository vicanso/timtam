'use strict';
const pkg = require('./package');
const logger = require('timtam-logger');
const config = require('./config');
const path = require('path');
const http = require('http');

initServer();

/**
 * [init description]
 * @return {[type]} [description]
 */
function initLogger() {
	logger.init({
		app: pkg.name
	});
	logger.add('console');
}


function initServer() {
	initLogger();
	let udpList = config.udpList.split(',');
	let args = [];
	if (config.logPath) {
		args.push('--logPath', config.logPath);
	}
	if (config.mongo) {
		args.push('--mongo', config.mongo);
	}
	let serverList = udpList.map(function(udp) {
		udp = udp.trim();
		let tmpArgs = args.slice(0);
		if (udp.indexOf(':') === -1) {
			udp = '127.0.0.1:' + udp;
		}
		let arr = udp.split(':');
		tmpArgs.push('--udp', udp);
		runReceiver(tmpArgs);
		return {
			type: 'udp',
			host: arr[0],
			port: arr[1]
		};
	});

	let currentIndex = 0;
	let getLogServer = function(app) {
		let server = serverList[currentIndex];
		currentIndex = (currentIndex + 1) % serverList.length;

		return server;
	};

	const server = http.createServer(function(req, res) {
		let index = req.url.indexOf('/udp/');
		if (index !== -1) {
			let app = req.url.substring(5);
			console.dir(app);
			res.writeHead(200, {
				'Content-Type': 'application/json; charset=utf-8'
			});
			res.end(JSON.stringify(getLogServer(app)));
		} else {
			res.writeHead(500, {
				'Content-Type': 'application/json; charset=utf-8'
			});
			res.end('{"error": "no log server"}');
		}
	});
	server.listen(config.port, function(err) {
		if (err) {
			console.error(err);
		} else {
			console.info('http server listen on:' + config.port);
		}
	});
}

function runReceiver(args) {
	const spawn = require('child_process').spawn;
	let file = path.join(__dirname, 'receiver');
	args.unshift(file);

	const cmd = spawn('node', args);

	cmd.stdout.on('data', function(data) {
		console.info('receiver:' + data);
	});

	cmd.stderr.on('data', function(data) {
		console.error('receiver:' + data);
	});

	cmd.on('close', function(code) {
		console.error('receiver exited with code:' + code);
		let timer = setTimeout(function() {
			runReceiver(args);
		}, 5 * 1000);
		timer.unref();
	});
}