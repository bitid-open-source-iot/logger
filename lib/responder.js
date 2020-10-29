var Q = require('q');

var module = function() {
	var responder = {
		errorResponse: {
			'error': {
				'code': 	401,
				'message': 	'General Error',
				'errors': [{
					'code': 		401,
					'reason': 		'General Error',
					'message': 		'General Error',
					'location': 	'Responder',
					'locationType': 'responder'
				}]
			}
		},

		response: {
			update: (result) => {
				var deferred = Q.defer();

				deferred.resolve({
					'updated': result.n
				});

				return deferred.promise;
			},

			delete: (result) => {
				var deferred = Q.defer();

				deferred.resolve({
					'deleted': result.n
				});

				return deferred.promise;
			},

			logger: {
				add: (result) => {
					var deferred = Q.defer();

					deferred.resolve({
						'loggerId': result._id
					});

					return deferred.promise;
				},

				get: (result) => {
					var deferred  = Q.defer();

					var tmp = {
						'role': 		result.role,
						'loggerId': 	result._id,
						'whitelist':	result.whitelist,
						'serverDate':	result.serverDate,
						'description':	result.description
					};

					if (typeof(result.bitid) != 'undefined') {
						if (typeof(result.bitid.auth) != 'undefined') {
							tmp.users 				= result.bitid.auth.users;
							tmp.organizationOnly 	= result.bitid.auth.organizationOnly;
						};
					};
					
					deferred.resolve(tmp);
					
					return deferred.promise;
				},

				list: (result) => {
					var deferred  = Q.defer();
					
					result = result.map(obj => {
						var tmp = {
							'role': 		obj.role,
							'loggerId':		obj._id,
							'whitelist':	obj.whitelist,
							'serverDate':	obj.serverDate,
							'description':	obj.description
						};

						if (typeof(obj.bitid) != 'undefined' && typeof(obj.role) != 'undefined' && obj.role > 0) {
							if (typeof(obj.bitid.auth) != 'undefined') {
								tmp.users 				= obj.bitid.auth.users;
								tmp.organizationOnly 	= obj.bitid.auth.organizationOnly;
							};
						};

						return tmp;
					});
					
					deferred.resolve(result);
					
					return deferred.promise;
				},

				write: (result) => {
					var deferred  = Q.defer();
					
					deferred.resolve({
						'historicalId': result._id
					});
					
					return deferred.promise;
				},

				historical: (result) => {
					var deferred  = Q.defer();
					
					result = result.map(obj => {
						return {
							'data':			obj.data,
							'date':			obj.serverDate,
							'catagory':		obj.catagory,
							'loggerId':		obj.loggerId,
							'historicalId': obj._id
						};
					});
					
					deferred.resolve(result);
					
					return deferred.promise;
				}
			}
		},

		model: (req, result) => {
			var deferred = Q.defer();

			switch(req.originalUrl) {
				case('*'):
					deferred.resolve(result);
					break;

				case('/api/logger/add'):
					responder.response.logger.add(result).then(deferred.resolve, deferred.reject);
					break;
				case('/api/logger/get'):
					responder.response.logger.get(result).then(deferred.resolve, deferred.reject);
					break;
				case('/api/logger/list'):
					responder.response.logger.list(result).then(deferred.resolve, deferred.reject);
					break;
				case('/api/logger/write'):
					responder.response.logger.write(result).then(deferred.resolve, deferred.reject);
					break;
				case('/api/logger/historical'):
					responder.response.logger.historical(result).then(deferred.resolve, deferred.reject);
					break;

				case('/api/logger/share'):
				case('/api/logger/update'):
				case('/api/logger/unsubscribe'):
				case('/api/logger/updatesubscriber'):
					responder.response.update(result).then(deferred.resolve, deferred.reject);
					break;

				case('/api/logger/delete'):
					responder.response.delete(result).then(deferred.resolve, deferred.reject);
					break;
				
				default:
					deferred.resolve({
						'success': {
							'details': 'Your request resolved successfully but this payload is not modeled!'
						}
					});
					break;
			};

			return deferred.promise;
		},

		error: (req, res, err) => {
			res.status(err.error.code).json(err.error);
		},	

		success: (req, res, result) => {
			responder.model(req, result)
			.then(result => {
				if (Array.isArray(result)) {
					if (typeof(result[0]) !== 'undefined') {
						if (typeof(result[0].error) !== 'undefined') {
							if (result[0].error == 'No records found') {
								responder.errorResponse.error.code 	= 401;
								responder.errorResponse.error.message = 'No records found!';
							};
							responder.error(req, res, responder.errorResponse);
							return;				
						};
					};
				};

				res.json(result);
			}, err => {
				responder.errorResponse.error.code 	= 401;
				responder.errorResponse.error.message = err;
				responder.error(req, res, responder.errorResponse);
			});
		}
	};

	return responder;
};

exports.module = module;