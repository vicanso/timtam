'use strict';
const pkg = require('./package');
const program = require('commander');
const env = process.env.NODE_ENV || 'development';
const defaultUdpList = env === 'development' ? '6300,6400' : '6001,6002';
const defautHttpPort = env === 'development' ? 6200 : 6000;
program
	.version(pkg.version)
	.option('-p, --port <n>', 'HTTP Port, default is 6000')
	.option('--udpList <n>', 'UDP Port, default is 6001,6002, eg:--udpList=6001 --udpList=6001,6002')
	.option('--mongo <n>', 'Mongodb uri, eg:--mongo=mongodb://localhost/timtam')
	.option('--udp <n>', 'child_process udp port, app will set it auto.')
	.option('--zmq <n>', 'eg: 192.168.1.1:6010')
	.option('-l, --logPath <n>', 'The path for log file')
	.parse(process.argv);

exports.env = env;

exports.port = program.port || defautHttpPort;

exports.udpList = program.udpList || defaultUdpList;

exports.udp = program.udp;

exports.copyPort = 9000;

exports.mongo = program.mongo;

exports.zmq = program.zmq;

exports.logPath = program.logPath;

exports.appUrlPrefix = env === 'development' ? '' : '/timtam';