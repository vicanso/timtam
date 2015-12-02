'use strict';
const pkg = require('./package');
const program = require('commander');

program
	.version(pkg.version)
	.option('-p, --port <n>', 'HTTP Port, default is 6000')
	.option('--udpList <n>', 'UDP Port, default is 6001,6002, eg:--udpList=6001 --udpList=6001,6002')
	.option('--mongo <n>', 'Mongodb uri, eg:--mongo=mongodb://localhost/timtam')
	.option('--udp <n>', 'child_process udp port, app will set it auto.')
	.option('--zmq <n>', 'eg: 192.168.1.1:6010')
	.option('-l, --logPath <n>', 'The path for log file')
	.parse(process.argv);

exports.port = program.port || 6000;

exports.udpList = program.udpList || '6001,6002';

exports.udp = program.udp;

exports.copyPort = 9000;

exports.mongo = program.mongo;

exports.zmq = program.zmq;

exports.logPath = program.logPath