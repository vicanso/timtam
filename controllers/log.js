'use strict';
const timtamMongo = require('../../timtam-mongo');
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
		// conditions: Joi.object().default({}),
		begin: Joi.string().length(10).regex(/^\d{4}\-\d{2}\-\d{2}/),
		end: Joi.string().length(10).regex(/^\d{4}\-\d{2}\-\d{2}/),
		limit: Joi.number().integer().min(1).max(100).default(30),
		skip: Joi.number().integer().min(0).default(0)
	});
	let options = _.pick(data, ['limit', 'skip']);
	let docs = yield timtamMongo.get(collection, {}, options);
	ctx.body = docs;
}

function* listApp() {
	/*jshint validthis:true */
	let ctx = this;
	yield Promise.resolve();
	ctx.body = ['test', 'timtam'];
}



// .regex(/^[abc]+$/);