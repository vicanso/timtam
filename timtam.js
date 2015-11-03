const timtam = require('timtam');
const program = require('commander');
const pkg = require('./package')
const util = require('util');
const fileTransport = timtam.transports.file;
const timtamMongo = require('timtam-mongo');

console.dir(timtamMongo);


/**
 * [convertToInt description]
 * @param  {[type]} v            [description]
 * @param  {[type]} defaultValue [description]
 * @return {[type]}              [description]
 */
function convertToInt(v, defaultValue) {
	if (util.isUndefined(v)) {
		v = defaultValue;
	}
	return parseInt(v);
}


/**
 * [init description]
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
function init(options) {
	fileTransport.logPath = options.logPath;
	timtam.addTransport(fileTransport);

	timtamMongo.init(options.mongo);
	timtam.addTransport(timtamMongo);
	
	timtam.bindUDP(options.port);
}

program
	.version(pkg.version)
	.option('-p, --port <n>', 'listen port', convertToInt, 6000)
	.option('-l, --logPath <n>', 'the path save log file', '/timtam-log-path')
	.option('--mongo <n>', 'the mongodb connection uri', 'mongodb://localhost/timtam')
	.parse(process.argv);

init(program);