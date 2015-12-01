'use strict';
const pkg = require('./package');
const config = require('./config');
const timtamMongo = require('timtam-mongo');
const timtamReceiver = require('timtam-receiver');
const url = require('url');

run();


function run() {
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
	let arr = config.udp.split(':');
	let port = arr[1];
	let host = arr[0];

	timtamReceiver.bindUDP(port, host);
}