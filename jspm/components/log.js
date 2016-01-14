'use strict';
import io from 'socket.io-client';
import _ from 'lodash';
var tagInfos = null;
const subTags = [];
const socket = io('http://localhost:3000', {
	reconnection: true
});

socket.on('tags', (data) => {
	tagInfos = data;
});


export function getTags() {
	return tagInfos;
}


export function sub(tag) {
	if (tag && !~_.indexOf(subTags, tag)) {
		subTags.push(tag);
		socket.emit('sub', tag);
	}
}

export function unsub(tag) {
	const index = _.indexOf(subTags, tag);
	if (~index) {
		subTags.splice(index, 1);
	}
	socket.emit('unsub', tag);
}

export function on(event, listener) {
	socket.on(event, listener);
}

export function off(event, listener) {
	socket.off(event, listener);
}


socket.on('connect', () => {
	console.info('connect');
	_.forEach(subTags, tag => {
		socket.emit('sub', tag);
	});
});


socket.on('connect_error', (err) => {
	console.error('connect_error:' + err.emssage);
});
socket.on('connect_timeout', () => {
	console.error('connect_timeout');
});
socket.on('reconnect_attempt', () => {
	console.info('reconnect_attempt');
});
socket.on('reconnecting', () => {
	console.info('reconnecting');
});
socket.on('reconnect_error', (err) => {
	console.error('reconnect_error:' + err.message);
});
socket.on('reconnect_failed', () => {
	console.error('reconnect_failed');
});

// socket.on('tags', (tagInfos) => {
// 	console.dir(tagInfos);
// });
// socket.on('data', (tag, msg) => {
// 	console.dir(tag);
// 	console.dir(msg);
// });