'use strict';
import io from 'socket.io-client'

const socket = io('http://localhost:3000', {
	reconnection: true
});

socket.on('connect', () => {
	console.info('connect');
	socket.emit('sub', 'test');

	setTimeout(() => {
		socket.emit('unsub', 'test');
	}, 30000);
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

socket.on('tags', (tagInfos) => {
	console.dir(tagInfos);
});
socket.on('data', (tag, msg) => {
	console.dir(tag);
	console.dir(msg);
});