'use strict';
const pkg = require('./package');
const config = require('./config');
const logger = require('timtam-logger');
const timtamReceiver = require('timtam-receiver');
const timtamMongo = require('timtam-mongo');

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
	if (config.mongo) {
		timtamMongo.init(config.mongo);
		timtamReceiver.addTransport(timtamMongo);
	}
	if (config.logPath) {
		let fileTransport = timtamReceiver.transports.file;
		fileTransport.logPath = config.logPath;
		timtamReceiver.addTransport(fileTransport);
		console.info('log file save in path:' + config.logPath);
	}
	timtamReceiver.bindUDP(config.port);
}