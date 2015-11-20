'use strict';

var Emitter = require('component/emitter');
var debug = require('component/debug');

exports.emitterWrapper = emitterWrapper;
exports.debug = getDebug();
exports.formatDate = formatDate;


/**
 * [emitterWrapper 添加emiiter相关函数]
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
function emitterWrapper(obj) {
	var emitter = new Emitter();
	_.forEach(_.functions(emitter), function(fn) {
		obj[fn] = emitter[fn];
	});
}


/**
 * [getDebug description]
 * @return {[type]} [description]
 */
function getDebug() {
	return debug('jt.albi');
}


/**
 * [formatDate description]
 * @param  {[type]} date  [description]
 * @param  {[type]} addMs [description]
 * @return {[type]}       [description]
 */
function formatDate(date, addMs) {
	var year = date.getFullYear();

	var month = date.getMonth() + 1;

	var day = date.getDate();

	if (month < 10) {
		month = '0' + month;
	}
	if (day < 10) {
		day = '0' + day;
	}

	var hours = date.getHours();
	if (hours < 10) {
		hours = '0' + hours;
	}

	var minutes = date.getMinutes();
	if (minutes < 10) {
		minutes = '0' + minutes;
	}

	var seconds = date.getSeconds();
	if (seconds < 10) {
		seconds = '0' + seconds;
	}


	var str = '' + year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
	if (addMs) {
		var ms = date.getTime() % 1000;
		ms = '00' + ms;

		ms = '.' + ms.substring(ms.length - 3);
		str += ms;
	}
	return str;
}