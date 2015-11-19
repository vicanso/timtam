'use strict';
requirejs(['component/app', 'component/rest', 'component/util', 'component/log-box'], function(app, rest, util, logBox) {

	window.TIMING.end('page');
	app.ready(function() {
		var log = logBox.render('logBoxContainer');
		log.setState({
			options: {
				time: false
			}
		})
	});

});