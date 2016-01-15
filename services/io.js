'use strict';
const socketIO = require('socket.io');
const debug = localRequire('helpers/debug');
const log = require('./log');
const _ = require('lodash');
const socketDict = [];

const subConnDict = {};

exports.init = init;

/**
 * [init description]
 * @param  {[type]} server [description]
 * @return {[type]}        [description]
 */

function init(server) {
	const io = socketIO(server);
	io.on('connection', initSocketEvent);
	log.on('tags', (data) => {
		_.forEach(socketDict, (socket) => {
			socket.emit('tags', data);
		});
	});
	log.on('data', (tag, msg) => {
		_.forEach(subConnDict[tag], (socket) => {
			socket.emit('data', tag, msg);
		});
	});
}


function initSocketEvent(socket) {
	console.info('socket connect');
	socket.on('sub', function(tag) {
		addSubConn(tag, socket);
	});

	socket.on('unsub', function(tag) {
		debug('unsub %s', tag || 'all');
		if (!tag) {
			_.forEach(subConnDict, (v, tag) => {
				removeSubConn(tag, socket);
			});
		} else {
			removeSubConn(tag, socket);
		}
	});
	socket.on('disconnect', function() {
		const index = _.indexOf(socketDict, socket);
		if (~index) {
			socketDict.splice(index, 1);
		}
		_.forEach(subConnDict, (v, tag) => {
			removeSubConn(tag, socket);
		});

		console.info('socket disconnect');
	});

	socket.emit('tags', log.tags());
	socketDict.push(socket);

}


function addSubConn(tag, socket) {
	const arr = subConnDict[tag] || [];
	if (!arr.length) {
		subConnDict[tag] = arr;
		log.sub(tag);
	}
	const index = _.indexOf(arr, socket);
	if (!~index) {
		arr.push(socket);
	}
}

function removeSubConn(tag, socket) {
	const arr = subConnDict[tag];
	const index = _.indexOf(arr, socket);
	if (~index) {
		arr.splice(index, 1);
	}
	if (!arr.length) {
		log.unsub(tag);
	}
}