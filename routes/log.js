'use strict';
module.exports = [{
	route: '/log/filter/:app',
	handler: 'log.filter'
}, {
	route: '/log/apps',
	handler: 'log.listApp'
}];