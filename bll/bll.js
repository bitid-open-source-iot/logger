var Q       = require('q');
var dal     = require('./../dal/dal');
var tools   = require('./../lib/tools');

var module = function() {
    var bllLogger = {
        errorResponse: {
            "error": {
                "code":    401,
                "message": "BLL Logger Error",
                "errors": [{
                    "code":         401,
                    "reason":       "General Logger Error",
                    "message":      "Logger Error",
                    "locaction":    "bllLogger",
                    "locationType": "body"
                }]
            },
            "hiddenErrors": []
        },

        socket: (data) => {
            var deferred = Q.defer();

            var myModule = new dal.module();
            myModule.logger.socket(data)
            .then(args => {
                deferred.resolve(args.result);
            }, err => {
                deferred.error(err);
            });

            return deferred.promise;
        },

        add: (req, res) => {
            var args = {
                "req": req,
                "res": res
            };

            var myModule = new dal.module();
            tools.insertOwnerIfNoneExists(args)
            .then(myModule.logger.add, null)
            .then(args => {
                __responder.success(req, res, args.result);
            }, err => {
                __responder.error(req, res, err);
            });
        },

        get: (req, res) => {
            var args = {
                "req": req,
                "res": res
            };

            var myModule = new dal.module();
            myModule.logger.get(args)
            .then(tools.setRoleObject, null)
            .then(args => {
                __responder.success(req, res, args.result);
            }, err => {
                __responder.error(req, res, err);
            });
        },

        list: (req, res) => {
            var args = {
                "req": req,
                "res": res
            };

            var myModule = new dal.module();
            myModule.logger.list(args)
            .then(tools.setRoleList, null)
            .then(args => {
                __responder.success(req, res, args.result);
            }, err => {
                __responder.error(req, res, err);
            });
        },

        write: (req, res) => {
            var args = {
                "req": req,
                "res": res
            };

            var myModule = new dal.module();
            myModule.logger.load(args)
            .then(args => {
                var deferred = Q.defer();

                try {
                    if (args.result.whitelist.enabled) {
                        console.log(args.req.headers.referer);
                        if (args.result.whitelist.hosts.includes(args.req.headers.referer)) {
                            deferred.resolve(args);
                        } else {
                            var err                     = bllLogger.errorResponse;
                            err.error.errors[0].code    = 401;
                            err.error.errors[0].reason  = 'Invalid credentials to write to log';
                            err.error.errors[0].message = 'Invalid credentials to write to log';
                            deferred.reject(err);
                        };
                    } else {
                        var users = args.result.bitid.auth.users.map(user => user.email);
                        if (users.includes(args.req.body.headers.email)) {
                            deferred.resolve(args);
                        } else {
                            var err                     = bllLogger.errorResponse;
                            err.error.errors[0].code    = 401;
                            err.error.errors[0].reason  = 'Invalid credentials to write to log';
                            err.error.errors[0].message = 'Invalid credentials to write to log';
                            deferred.reject(err);
                        };
                    };
                } catch (error) {
                    var err                     = bllLogger.errorResponse;
                    err.error.errors[0].code    = 503;
                    err.error.errors[0].reason  = error.message;
                    err.error.errors[0].message = error.message;
                    deferred.reject(err);
                };

                return deferred.promise;
            }, null)
            .then(myModule.logger.write, null)
            .then(args => {
                __responder.success(req, res, args.result);
            }, err => {
                __responder.error(req, res, err);
            });
        },

        share: (req, res) => {
            var args = {
                "req": req,
                "res": res
            };

            var myModule = new dal.module();
            myModule.logger.share(args)
            .then(args => {
                __responder.success(req, res, args.result);
            }, err => {
                __responder.error(req, res, err);
            });
        },

        update: (req, res) => {
            var args = {
                "req": req,
                "res": res
            };

            var myModule = new dal.module();
            myModule.logger.update(args)
            .then(args => {
                __responder.success(req, res, args.result);
            }, err => {
                __responder.error(req, res, err);
            });
        },

        delete: (req, res) => {
            var args = {
                "req": req,
                "res": res
            };

            var myModule = new dal.module();
            myModule.logger.delete(args)
            .then(args => {
                __responder.success(req, res, args.result);
            }, err => {
                __responder.error(req, res, err);
            });
        },

        historical: (req, res) => {
            var args = {
                "req": req,
                "res": res
            };

            var myModule = new dal.module();
            myModule.logger.historical(args)
            .then(args => {
                __responder.success(req, res, args.result);
            }, err => {
                __responder.error(req, res, err);
            });
        },

        unsubscribe: (req, res) => {
            var args = {
                "req": req,
                "res": res
            };

            var myModule = new dal.module();
            myModule.logger.unsubscribe(args)
            .then(args => {
                __responder.success(req, res, args.result);
            }, err => {
                __responder.error(req, res, err);
            });
        },

        updatesubscriber: (req, res) => {
            var args = {
                "req": req,
                "res": res
            };

            var myModule = new dal.module();
            myModule.logger.updatesubscriber(args)
            .then(args => {
                __responder.success(req, res, args.result);
            }, err => {
                __responder.error(req, res, err);
            });
        }
    };

    return {
        "logger": bllLogger
	};
};

exports.module = module;