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
	initCopy(config.copyPort);


	let arr = config.udp.split(':');
	let port = arr[1];
	let host = arr[0];

	timtamReceiver.bindUDP(port, host);
}

function initCopy(port) {
	const dgram = require('dgram');
	const client = dgram.createSocket('udp4');
	timtamReceiver.addTransport({
		write: function(app, data, buf) {
			client.send(buf, 0, buf.length, port, '127.0.0.1');
		}
	});
}