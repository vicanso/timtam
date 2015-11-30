'use strict';
const pkg = require('./package');
const program = require('commander');

program
	.version(pkg.version)
	.option('-p, --port <n>', 'UDP Port, default is 6000')
	.option('--mongo <n>', 'Mongodb uri, eg:mongodb://localhost/timtam')
	.option('-l, --logPath <n>', 'The path for log file')
	.parse(process.argv);

exports.port = program.port || 6000;

exports.mongo = program.mongo;

exports.logPath = program.logPath;