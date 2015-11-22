'use strict';
const timtamMongo = require('timtam-mongo');
const config = localRequire('config');
const Joi = require('joi');
const _ = require('lodash');

timtamMongo.init(config.logMongoServer);

exports.filter = filter;
exports.listApp = listApp;

function* filter() {
	/*jshint validthis:true */
	let ctx = this;
	let collection = ctx.params.app;
	let data = Joi.validateThrow(ctx.query, {
		begin: Joi.date().iso(),
		end: Joi.date().iso(),
		limit: Joi.number().integer().min(1).max(100).default(30),
		skip: Joi.number().integer().min(0).default(0)
	});
	let options = _.pick(data, ['limit', 'skip']);
	var conditions = {};
	var dateConditions = {};

	if (data.begin) {
		dateConditions['$gte'] = data.begin.toISOString();
	}
	if (data.end) {
		dateConditions['$lte'] = data.end.toISOString();
	}

	if (!_.isEmpty(dateConditions)) {
		conditions.date = dateConditions;
	}

	let docs = yield timtamMongo.get(collection, conditions, options);
	ctx.body = docs;
}

function* listApp() {
	/*jshint validthis:true */
	let ctx = this;
	yield Promise.resolve();
	ctx.body = ['test', 'timtam'];
}



// .regex(/^[abc]+$/);