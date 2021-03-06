const Q = require('q');
const db = require('./../db/mongo');
const format = require('./../lib/format');
const ObjectId = require('mongodb').ObjectId;
const ErrorResponse = require('./../lib/error-response');

var module = function () {
	var dalLogger = {
		add: (args) => {
			var deferred = Q.defer();

			var params = {
				'bitid': {
					'auth': {
						'users': args.req.body.users,
						'organizationOnly': args.req.body.organizationOnly
					}
				},
				'serverDate': new Date(),
				'description': args.req.body.description
			};

			if (typeof (args.req.body.whitelist) != 'object') {
				params.whitelist = {
					'hosts': [],
					'enabled': false
				};
			} else {
				params.whitelist = {
					'hosts': args.req.body.whitelist.hosts,
					'enabled': args.req.body.whitelist.enabled
				};
			};

			db.call({
				'params': params,
				'operation': 'insert',
				'collection': 'tblLogger'
			})
				.then(result => {
					args.result = result[0];
					deferred.resolve(args);
				}, error => {
					var err = new ErrorResponse();
					err.error.errors[0].code = error.code;
					err.error.errors[0].reason = error.message;
					err.error.errors[0].message = error.message;
					deferred.reject(err);
				});

			return deferred.promise;
		},

		get: (args) => {
			var deferred = Q.defer();

			var params = {
				'_id': ObjectId(args.req.body.loggerId),
				'bitid.auth.users.email': format.email(args.req.body.header.email)
			};

			var filter = {};
			if (typeof (args.req.body.filter) != 'undefined') {
				filter._id = 0;
				args.req.body.filter.map(f => {
					if (f == 'loggerId') {
						filter['_id'] = 1;
					} else if (f == 'role' || f == 'users') {
						filter['bitid.auth.users'] = 1;
					} else if (f == 'organizationOnly') {
						filter['bitid.auth.organizationOnly'] = 1;
					} else {
						filter[f] = 1;
					};
				});
			};

			db.call({
				'params': params,
				'filter': filter,
				'operation': 'find',
				'collection': 'tblLogger'
			})
				.then(result => {
					args.result = result[0];
					deferred.resolve(args);
				}, error => {
					var err = new ErrorResponse();
					err.error.errors[0].code = error.code;
					err.error.errors[0].reason = error.message;
					err.error.errors[0].message = error.message;
					deferred.reject(err);
				});

			return deferred.promise;
		},

		list: (args) => {
			var deferred = Q.defer();

			var params = {
				'bitid.auth.users.email': format.email(args.req.body.header.email)
			};

			var filter = {};
			if (typeof (args.req.body.filter) != 'undefined') {
				filter._id = 0;
				args.req.body.filter.map(f => {
					if (f == 'loggerId') {
						filter['_id'] = 1;
					} else if (f == 'role' || f == 'users') {
						filter['bitid.auth.users'] = 1;
					} else if (f == 'organizationOnly') {
						filter['bitid.auth.organizationOnly'] = 1;
					} else {
						filter[f] = 1;
					};
				});
			};

			db.call({
				'params': params,
				'filter': filter,
				'operation': 'find',
				'collection': 'tblLogger'
			})
				.then(result => {
					args.result = result;
					deferred.resolve(args);
				}, error => {
					var err = new ErrorResponse();
					err.error.errors[0].code = error.code;
					err.error.errors[0].reason = error.message;
					err.error.errors[0].message = error.message;
					deferred.reject(err);
				});

			return deferred.promise;
		},

		load: (args) => {
			var deferred = Q.defer();

			var params = {
				'_id': ObjectId(args.req.body.loggerId)
			};

			var filter = {
				'whitelist': 1,
				'bitid.auth.users.email': 1
			};

			db.call({
				'params': params,
				'filter': filter,
				'operation': 'find',
				'collection': 'tblLogger'
			})
				.then(result => {
					args.result = result[0];
					deferred.resolve(args);
				}, error => {
					var err = new ErrorResponse();
					err.error.errors[0].code = error.code;
					err.error.errors[0].reason = error.message;
					err.error.errors[0].message = error.message;
					deferred.reject(err);
				});

			return deferred.promise;
		},

		share: (args) => {
			var deferred = Q.defer();

			var params = {
				'bitid.auth.users': {
					$elemMatch: {
						'role': {
							$gte: 4
						},
						'email': format.email(args.req.body.header.email)
					}
				},
				'bitid.auth.users.email': {
					$ne: format.email(args.req.body.email)
				},
				'_id': ObjectId(args.req.body.loggerId)
			};
			var update = {
				$push: {
					'bitid.auth.users': {
						'role': args.req.body.role,
						'email': format.email(args.req.body.email)
					}
				}
			};

			db.call({
				'params': params,
				'update': update,
				'operation': 'update',
				'collection': 'tblLogger'
			})
				.then(result => {
					args.result = result;
					deferred.resolve(args);
				}, error => {
					var err = new ErrorResponse();
					err.error.errors[0].code = error.code;
					err.error.errors[0].reason = error.message;
					err.error.errors[0].message = error.message;
					deferred.reject(err);
				});

			return deferred.promise;
		},

		write: (args) => {
			var deferred = Q.defer();

			var params = {
				'data': args.req.body.data,
				'catagory': args.req.body.catagory,
				'loggerId': args.req.body.loggerId,
				'serverDate': new Date()
			};

			db.call({
				'params': params,
				'operation': 'insert',
				'collection': 'tblHistorical'
			})
				.then(result => {
					args.result = result[0];
					deferred.resolve(args);
				}, error => {
					var err = new ErrorResponse();
					err.error.errors[0].code = error.code;
					err.error.errors[0].reason = error.message;
					err.error.errors[0].message = error.message;
					deferred.reject(err);
				});

			return deferred.promise;
		},

		update: (args) => {
			var deferred = Q.defer();

			var params = {
				'bitid.auth.users': {
					$elemMatch: {
						'role': {
							$gte: 2,
							$lte: 5
						},
						'email': format.email(args.req.body.header.email)
					}
				},
				'_id': ObjectId(args.req.body.loggerId)
			};
			var update = {
				$set: {
					'serverDate': new Date()
				}
			};
			if (typeof (args.req.body.whitelist) != 'undefined') {
				if (Array.isArray(args.req.body.whitelist.hosts)) {
					update.$set['whitelist.hosts'] = args.req.body.whitelist.hosts;
				};
				if (typeof (args.req.body.whitelist.enabled) != 'undefined') {
					update.$set['whitelist.enabled'] = args.req.body.whitelist.enabled;
				};
			};
			if (typeof (args.req.body.description) != 'undefined') {
				update.$set.description = args.req.body.description;
			};
			if (typeof (args.req.body.organizationOnly) != 'undefined') {
				update.$set['bitid.auth.organizationOnly'] = args.req.body.organizationOnly;
			};

			db.call({
				'params': params,
				'update': update,
				'operation': 'update',
				'collection': 'tblLogger'
			})
				.then(result => {
					args.result = result;
					deferred.resolve(args);
				}, error => {
					var err = new ErrorResponse();
					err.error.errors[0].code = error.code;
					err.error.errors[0].reason = error.message;
					err.error.errors[0].message = error.message;
					deferred.reject(err);
				});

			return deferred.promise;
		},

		delete: (args) => {
			var deferred = Q.defer();

			var params = {
				'bitid.auth.users': {
					$elemMatch: {
						'role': 5,
						'email': format.email(args.req.body.header.email)
					}
				},
				'_id': ObjectId(args.req.body.loggerId)
			};

			db.call({
				'params': params,
				'operation': 'remove',
				'collection': 'tblLogger'
			})
				.then(result => {
					var deferred = Q.defer();

					args.result = result;

					var params = {
						'loggerId': args.req.body.loggerId
					};

					deferred.resolve({
						'params': params,
						'operation': 'remove',
						'collection': 'tblHistorical'
					});

					return deferred.promise;
				}, null)
				.then(db.call, null)
				.then(result => {
					deferred.resolve(args);
				}, error => {
					var err = new ErrorResponse();
					err.error.errors[0].code = error.code;
					err.error.errors[0].reason = error.message;
					err.error.errors[0].message = error.message;
					deferred.reject(err);
				});

			return deferred.promise;
		},

		socket: (args) => {
			var deferred = Q.defer();

			var params = {
				'data': args.data,
				'catagory': args.catagory,
				'loggerId': args.loggerId,
				'serverDate': new Date()
			};

			db.call({
				'params': params,
				'operation': 'insert',
				'collection': 'tblHistorical'
			})
				.then(result => {
					args.result = result[0];
					deferred.resolve(args);
				}, error => {
					var err = new ErrorResponse();
					err.error.errors[0].code = error.code;
					err.error.errors[0].reason = error.message;
					err.error.errors[0].message = error.message;
					deferred.reject(err);
				});

			return deferred.promise;
		},

		historical: (args) => {
			var deferred = Q.defer();

			var params = {
				'bitid.auth.users.email': format.email(args.req.body.header.email)
			};

			if (typeof (args.req.body.loggerId) != 'undefined') {
				if (Array.isArray(args.req.body.loggerId)) {
					params._id = {
						$in: args.req.body.loggerId.map(id => ObjectId(id))
					};
				} else if (typeof (args.req.body.loggerId) == 'string') {
					params._id = ObjectId(args.req.body.loggerId);
				};
			};
			if (typeof (args.req.body.skip) == 'number') {
				var skip = args.req.body.skip;
			};
			if (typeof (args.req.body.sort) == 'object') {
				var sort = args.req.body.sort;
			};
			if (typeof (args.req.body.limit) == 'number' && args.req.body.limit <= 100000) {
				var limit = args.req.body.limit;
			};

			var filter = {
				'_id': 1
			};

			db.call({
				'skip': skip,
				'sort': sort,
				'limit': limit,
				'filter': filter,
				'operation': 'find',
				'collection': 'tblLogger'
			})
				.then(result => {
					var deferred = Q.defer();

					args.req.body.loggerId = result.map(logger => logger._id.toString());

					var params = {
						'loggerId': {
							$in: args.req.body.loggerId
						}
					};
					if (typeof (args.req.body.to) != 'undefined' || typeof (args.req.body.from) != 'undefined') {
						params.serverDate = {};
					};
					if (typeof (args.req.body.to) != 'undefined') {
						params.serverDate.$lte = new Date(args.req.body.to);
					};
					if (typeof (args.req.body.from) != 'undefined') {
						params.serverDate.$gte = new Date(args.req.body.from);
					};
					if (typeof (args.req.body.skip) == 'number') {
						var skip = args.req.body.skip;
					};
					if (typeof (args.req.body.sort) == 'object') {
						var sort = args.req.body.sort;
					};
					if (typeof (args.req.body.limit) == 'number') {
						var limit = args.req.body.limit;
					};

					var filter = {};
					if (typeof (args.req.body.filter) != 'undefined') {
						filter._id = 0;
						args.req.body.filter.map(f => {
							if (f == 'historicalId') {
								filter['_id'] = 1;
							} else if (f == 'date') {
								filter['serverDate'] = 1;
							} else {
								filter[f] = 1;
							};
						});
					};

					deferred.resolve({
						'sort': sort,
						'skip': skip,
						'limit': limit,
						'params': params,
						'filter': filter,
						'operation': 'find',
						'collection': 'tblHistorical'
					});

					return deferred.promise;
				}, null)
				.then(db.call, null)
				.then(result => {
					args.result = result;
					deferred.resolve(args);
				}, error => {
					var err = new ErrorResponse();
					err.error.errors[0].code = error.code;
					err.error.errors[0].reason = error.message;
					err.error.errors[0].message = error.message;
					deferred.reject(err);
				});

			return deferred.promise;
		},

		unsubscribe: (args) => {
			var deferred = Q.defer();

			var params = {
				'bitid.auth.users': {
					$elemMatch: {
						'email': format.email(args.req.body.header.email)
					}
				},
				'_id': ObjectId(args.req.body.loggerId)
			};
			var update = {
				$set: {
					'serverDate': new Date()
				},
				$pull: {
					'bitid.auth.users': {
						'email': format.email(args.req.body.email)
					}
				}
			};

			db.call({
				'params': params,
				'update': update,
				'operation': 'update',
				'collection': 'tblLogger'
			})
				.then(result => {
					args.result = result;
					deferred.resolve(args);
				}, error => {
					var err = new ErrorResponse();
					err.error.errors[0].code = error.code;
					err.error.errors[0].reason = error.message;
					err.error.errors[0].message = error.message;
					deferred.reject(err);
				});

			return deferred.promise;
		},

		updatesubscriber: (args) => {
			var deferred = Q.defer();

			var params = {
				'bitid.auth.users': {
					$elemMatch: {
						'role': {
							$gte: 4
						},
						'email': format.email(args.req.body.header.email)
					}
				},
				'_id': ObjectId(args.req.body.loggerId)
			};

			db.call({
				'params': params,
				'operation': 'find',
				'collection': 'tblLogger'
			})
				.then(result => {
					var deferred = Q.defer();

					var params = {
						'bitid.auth.users': {
							$elemMatch: {
								'email': format.email(args.req.body.email)
							}
						},
						'_id': ObjectId(args.req.body.loggerId)
					};
					var update = {
						$set: {
							'bitid.auth.users.$.role': args.req.body.role
						}
					};

					deferred.resolve({
						'params': params,
						'update': update,
						'operation': 'update',
						'collection': 'tblLogger'
					});

					return deferred.promise;
				}, null)
				.then(db.call, null)
				.then(result => {
					args.result = result;
					deferred.resolve(args);
				}, error => {
					var err = new ErrorResponse();
					err.error.errors[0].code = error.code;
					err.error.errors[0].reason = error.message;
					err.error.errors[0].message = error.message;
					deferred.reject(err);
				});

			return deferred.promise;
		}
	};

	return {
		'logger': dalLogger
	};
};

exports.module = module;