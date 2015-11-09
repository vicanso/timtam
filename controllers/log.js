'use strict';
const Joi = require('joi');
const moment = require('moment');
const _ = require('lodash');
const timtamMongo = require('../../timtam-mongo');
timtamMongo.init('mongodb://localhost/timtam');

exports.filter = filter;
exports.count = count;


function* filter() {
	/*jshint validthis:true */
	let ctx = this;
	let result = convert(ctx.request.query);
	let docs = yield timtamMongo.get(ctx.params.app, result.conditions, result.options);
	ctx.body = docs;
}

function* count() {
	/*jshint validthis:true */
	let ctx = this;
	let result = convert(ctx.request.query);
	let total = yield timtamMongo.count(ctx.params.app, result.conditions);
	ctx.body = {
		count: total
	};
}


function convert(query) {
	let today = moment().format('YYYY-MM-DD');
	query = Joi.validateThrow(query, {
		message: Joi.string().optional(),
		level: Joi.string().valid('log', 'info', 'warn', 'error').optional(),
		limit: Joi.number().integer().min(1).max(100).default(10),
		skip: Joi.number().integer().min(0).default(0),
		beginDate: Joi.string().isoDate().default(today + 'T00:00:00.000Z'),
		endDate: Joi.string().isoDate().default(today + 'T24:00:00.000Z')
	});
	let keys = ['limit', 'skip'];
	let conditions = _.omit(query, keys);
	conditions.date = {
		'$gte': conditions.beginDate,
		'$lte': conditions.endDate
	};
	delete conditions.beginDate;
	delete conditions.endDate;
	if (conditions.message) {
		conditions.message = new RegExp(conditions.message, 'i');
	}

	let options = _.pick(query, keys);
	return {
		conditions: conditions,
		options: options
	};
}