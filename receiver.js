'use strict';
const pkg = require('./package');
const config = require('./config');
const timtamReceiver = require('timtam-receiver');
const url = require('url');

run();


function run() {
	if (config.mongo) {
		const timtamMongo = require('timtam-mongo');
		timtamMongo.init(config.mongo);
		timtamReceiver.addTransport(timtamMongo);
	}
	if (config.logPath) {
		let fileTransport = timtamReceiver.transports.file;
		fileTransport.logPath = config.logPath;
		timtamReceiver.addTransport(fileTransport);
		console.info('log file save in path:' + config.logPath);
	}
	if (config.zmq) {
		const timtamZmq = require('timtam-zmq');
		let zmqArr = config.zmq.split(':');
		timtamZmq.init(zmqArr[1], zmqArr[0]);
	}
	let arr = config.udp.split(':');
	let port = arr[1];
	let host = arr[0];

	timtamReceiver.bindUDP(port, host);
}