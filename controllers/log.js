'use strict';
const timtamMongo = require('../../timtam-mongo');
const config = localRequire('config');
const Joi = require('joi');
const _ = require('lodash');

timtamMongo.init(config.logMongoServer);

exports.filter = filter;

function* filter() {
	/*jshint validthis:true */
	let ctx = this;
	let collection = ctx.params.app;
	let data = Joi.validateThrow(ctx.query, {
		conditions: Joi.object().default({}),
		limit: Joi.number().integer().min(1).max(100).default(30),
		skip: Joi.number().integer().min(0).default(0)
	});
	let options = _.pick(data, ['limit', 'skip']);
	let docs = yield timtamMongo.get(collection, data.conditions, options);
	ctx.body = docs;
}