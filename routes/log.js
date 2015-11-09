'use strict';

module.exports = [{
	route: '/log/filter/:app',
	handler: 'log.filter'
}, {	route: '/log/count/:app',
	handler: 'log.count'
}];