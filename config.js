'use strict';
const pkg = require('./package');
const program = require('commander');

program
	.version(pkg.version)
	.option('-p, --port <n>', 'HTTP Port, default is 6000')
	.option('--udp-list <n>', 'UDP Port, default is 6001,6002, eg:--udpList=6001 --udpList=6001,6002')
	.option('--mongo <n>', 'Mongodb uri, eg:--mongo=mongodb://localhost/timtam')
	.option('--udp <n>', 'child_process udp port, app will set it auto.')
	.option('-l, --log-path <n>', 'The path for log file')
	.parse(process.argv);

exports.port = program.port || 6000;

exports.udpList = program['udp-list'] || '6001,6002';

exports.udp = program.udp;

exports.mongo = program.mongo;

exports.logPath = program['log-path'];