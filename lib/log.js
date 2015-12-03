'use strict';
const config = require('../config');
const EventEmitter = require('events');
const emitter = new EventEmitter();

module.exports = emitter;

initUDPServer(config.copyPort);


/**
 * [initUDPServer 初始化udp server，用于获取child process复制的udp log]
 * @param  {[type]} port [description]
 * @return {[type]}      [description]
 */
function initUDPServer(port) {
	const dgram = require('dgram');
	const server = dgram.createSocket('udp4');

	server.on('error', function(err) {
		console.log('server error:' + err.stack);
		server.close();
		let timer = setTimeout(function() {
			initUDPServer(port);
		}, 5 * 1000);
		timer.unref();
	});

	server.on('message', function(buf) {
		let data = JSON.parse(buf);
		emitter.emit(data.app, data.log);
	});

	server.on('listening', function() {
		var address = server.address();
		console.log('server listening ' +
			address.address + ':' + address.port);
	});

	server.bind(port, '127.0.0.1');
}