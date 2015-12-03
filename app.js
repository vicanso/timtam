'use strict';
const pkg = require('./package');
const logger = require('timtam-logger');
const config = require('./config');
const path = require('path');
const http = require('http');
const fs = require('fs');
const io = require('./lib/io');
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

/**
 * [initServer 初始化]
 * @return {[type]} [description]
 */
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


	let httpServer = initHTTPServer(serverList, config.port);
	io.init(httpServer);
}

/**
 * [runReceiver 以child process的方式运行timtam receiver]
 * @param  {[type]} args [description]
 * @return {[type]}      [description]
 */
function runReceiver(args) {
	const spawn = require('child_process').spawn;
	let file = path.join(__dirname, 'receiver');
	args.unshift(file);

	const cmd = spawn('node', args);

	cmd.stdout.on('data', function(data) {
		console.info('receiver ' + data);
	});

	cmd.stderr.on('data', function(data) {
		console.error('receiver ' + data);
	});

	cmd.on('close', function(code) {
		console.error('receiver exited with code:' + code);
		let timer = setTimeout(function() {
			runReceiver(args);
		}, 5 * 1000);
		timer.unref();
	});
}



/**
 * [initHTTPServer 初始化http server，用于返回timtam recevier的类型和ip]
 * @param  {[type]} serverList [description]
 * @param  {[type]} port       [description]
 * @return {[type]}            [description]
 */
function initHTTPServer(serverList, port) {
	const appUrlPrefix = config.appUrlPrefix;
	const server = http.createServer(function(req, res) {
		let url = req.url;
		if (appUrlPrefix) {
			if (url.indexOf(appUrlPrefix) !== 0) {
				res.writeHead(404);
				res.end('Not Found');
				return;
			} else {
				url = url.substring(appUrlPrefix.length);
			}
		}
		if (url === '/index.html') {
			fs.readFile(__dirname + '/public/index.html',
				function(err, data) {
					if (err) {
						res.writeHead(500);
						return res.end('Error loading index.html');
					}
					res.writeHead(200);
					res.end(data);
				});
		} else if (url === '/udp') {
			let app = req.url.substring(5);
			res.writeHead(200, {
				'Content-Type': 'application/json; charset=utf-8'
			});
			res.end(JSON.stringify(serverList));
		} else {
			res.writeHead(404);
			res.end('Not Found');
		}
	});
	server.listen(port, function(err) {
		if (err) {
			console.error(err);
		} else {
			console.info('http server listen on:' + port);
		}
	});

	return server;
}