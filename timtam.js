'use strict';
const receiver = require('timtam-receiver');
const timtamMongo = require('timtam-mongo');
const program = require('commander');
const pkg = require('./package');
const url = require('url');


program
	.version(pkg.version)
	.option('-l, --log <n>', 'Log Path')
	.option('--server <n>', 'Log Server', splitServer)
	.option('--mongo <n>', 'Mongo Server')
	.parse(process.argv);
init();

/**
 * [splitServer description]
 * @param  {[type]} v [description]
 * @return {[type]}   [description]
 */
function splitServer(v) {
	if (!v) {
		return;
	}
	return v.split(',').map(function(tmp) {
		let urlInfos = url.parse(tmp);
		return {
			type: urlInfos.protocol === 'tcp:' ? 'tcp' : 'udp',
			port: parseInt(urlInfos.port),
			host: urlInfos.hostname
		};
	});
}

/**
 * [init description]
 * @return {[type]} [description]
 */
function init() {
	if (program.log) {
		let fileTransport = receiver.transports.file;
		fileTransport.logPath = program.log;
		receiver.addTransport(fileTransport);
		console.info('log save at:' + program.log);
	}
	if (program.mongo) {
		timtamMongo.init(program.mongo);
		receiver.addTransport(timtamMongo);
	}
	if (program.server) {
		program.server.forEach(function(server) {
			if (server.type == 'udp') {
				receiver.bindUDP(server.port, server.host);
			} else {
				receiver.bindTCP(server.port, server.host);
			}
		});
	}
}