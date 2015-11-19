'use strict';

var http = require('component/http');


exports.exception = exception;
exports.statistics = statistics;
exports.requirejsStats = requirejsStats;
exports.user = user;
exports.ajaxStats = ajaxStats;
exports.logs = logs;

function format(date) {
	date = new Date(date);
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

	var ms = date.getTime() % 1000;
	ms = '00' + ms;

	ms = '.' + ms.substring(ms.length - 3);

	return '' + year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds + ms;
}


function logs(app, query) {
	var res = get('/log/filter/' + app);
	res.then(function(data) {
		_.forEach(data, function(item) {
			var arr = format(item.date).split(' ');
			item.time = arr[1];
			item.date = arr[0];
		});
		return data;
	});
	return res;
}


/**
 * [exception 异常出错统计]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
function exception(data) {
	return post('/stats/exception', data);
}

/**
 * [statistics 统计分析上传]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
function statistics(data) {
	return post('/stats/statistics', data);
}


/**
 * [requirejsStats requirejs的加载统计]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
function requirejsStats(data) {
	return post('/stats/requirejs', data);
}

/**
 * [ajaxStats ajax请求状态统计]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
function ajaxStats(data) {
	return post('/stats/ajax', data);
}

/**
 * [user description]
 * @return {[type]} [description]
 */
function user() {
	return get('/1/users/me', {
		'Cache-Control': 'no-cache'
	});
}


/**
 * [get description]
 * @param  {[type]} url     [description]
 * @param  {[type]} headers [description]
 * @return {[type]}         [description]
 */
function get(url, headers) {
	return new Promise(function(resolve, reject) {
		http.get(url, headers).then(function(res) {
			if (res.type === 'application/json') {
				resolve(res.body);
			} else {
				resolve(res.text);
			}
		}, reject);
	});
}

/**
 * [post description]
 * @param  {[type]} url     [description]
 * @param  {[type]} data    [description]
 * @param  {[type]} headers [description]
 * @return {[type]}         [description]
 */
function post(url, data, headers) {
	return new Promise(function(resolve, reject) {
		http.post(url, data, headers).then(function(res) {
			if (res.type === 'application/json') {
				resolve(res.body);
			} else {
				resolve(res.text);
			}
		}, reject);
	});
}