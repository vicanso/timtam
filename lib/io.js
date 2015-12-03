'use strict';
const socketIO = require('socket.io');
const debug = require('debug')('jt.io');
const log = require('./log');


exports.init = init;

/**
 * [init description]
 * @param  {[type]} server [description]
 * @return {[type]}        [description]
 */
function init(server) {
	const io = socketIO(server);
	io.on('connection', initSocketEvent);
}


function initSocketEvent(socket) {
	const watchEvent = {};
	const emptyAllWatch = function() {
		let apps = Object.keys(watchEvent);
		apps.forEach(function(app) {
			log.removeListener(app, watchEvent[app]);
			delete watchEvent[app];
		});
	};

	socket.on('watch', function(app) {
		if (!watchEvent[app]) {
			let fn = function(data) {
				socket.emit('log', app, data);
			};
			log.on(app, fn);
			watchEvent[app] = fn;
		}
	});

	socket.on('unwatch', function(app) {
		debug('unwatch %s', app || 'all');
		if (!app) {
			emptyAllWatch();
		} else if (watchEvent[app]) {
			log.removeListener(app, watchEvent[app]);
			delete watchEvent[app];
		}
	});
	socket.on('disconnect', function() {
		emptyAllWatch();
		console.info('socket disconnect');
	});
}