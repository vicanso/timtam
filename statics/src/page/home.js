'use strict';
requirejs(['component/app', 'component/rest', 'component/util', 'component/log-box'], function(app, rest, util, logBox) {

	window.TIMING.end('page');
	app.ready(function() {
		logBox.render('logBoxContainer');
		rest.user().then(function(res) {
			util.debug('user info:%j', res);
		}, function(err) {
			console.dir(err);
		});
	});

});