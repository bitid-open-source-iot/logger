var Q                   = require('q');
var db                  = require('./db/mongo');
var auth                = require('./lib/auth');
var cors                = require('cors');
var http                = require('http');
var chalk               = require('chalk');
var socket              = require('./lib/socket');
var express             = require('express');
var responder           = require('./lib/responder');
var bodyParser          = require('body-parser');

global.__base           = __dirname + '/';
global.__sockets        = [];
global.__settings       = require('./config.json');
global.__responder      = new responder.module();

try {
    var portal = {
        errorResponse: {
            "error": {
                "code":     401,
                "message":  "Invalid Credentials",
                "errors":[{
                    "reason":       "Portal Error",
                    "message":      "Portal Error",
                    "locaction":    "portal",
                    "locationType": "portal"
                }]
            },
            "hiddenErrors":[]
        },

        api: (args) => {
            var deferred    = Q.defer();

            try {
                var app    = express();
                app.use(cors());
                app.use(bodyParser.urlencoded({
                    'limit':    '50mb',
                    'extended': true
                }));
                app.use(bodyParser.json({
                    "limit": '50mb'
                }));

                if (args.settings.authentication) {
                    app.use((req, res, next) => {
                        if (req.method != 'GET' && req.method != 'PUT') {
                            auth.authenticate({
                                'req': req,
                                'res': res
                            })
                            .then(result => {
                                next(); 
                            }, err => {
                                console.log("body error: ", req.body)
                                console.log("error: ", err)
                                err.error.code              = 401;
                                err.error.errors[0].code    = 401;
                                __responder.error(req, res, err);
                            });
                        } else {
                            next();
                        };
                    });
                };

                app.use('/', express.static(__dirname + '/app/dist/logger/'));
                app.get('/*', (req, res) => {
                    res.sendFile(__dirname + '/app/dist/logger/index.html');
                });

                var logger = require('./api/logger');
                app.use('/api/logger', logger);

                app.use((err, req, res, next) => {
                    portal.errorResponse.error.code              = 500;
                    portal.errorResponse.error.message           = 'Something broke';
                    portal.errorResponse.error.errors[0].code    = 500;
                    portal.errorResponse.error.errors[0].message = 'Something broke';
                    portal.errorResponse.hiddenErrors.push(err.stack);
                    __responder.error(req, res, portal.errorResponse);
                });

                var server = http.createServer(app);
                server.listen(args.settings.localwebserver.port);
                deferred.resolve(args);
            } catch(err) {
                deferred.reject(err.message);
            };
            
            return deferred.promise;
        },

        init: (args) => {
            if (!args.settings.production || !args.settings.authentication) {
                var index = 0;
                console.log('');
                console.log('=======================');
                console.log('');
                console.log(chalk.yellow('Warning: '));
                if (!args.settings.production) {
                    index++;
                    console.log('');
                    console.log(chalk.yellow(index + ': You are running in ') + chalk.red('"Development Mode!"') + chalk.yellow(' This can cause issues if this environment is a production environment!'));
                    console.log('');
                    console.log(chalk.yellow('To enable production mode, set the ') + chalk.bold(chalk.green('production')) + chalk.yellow(' variable in the config to ') + chalk.bold(chalk.green('true')) + chalk.yellow('!'));
                };
                if (!args.settings.authentication) {
                    index++;
                    console.log('');
                    console.log(chalk.yellow(index + ': Authentication is not enabled ') + chalk.yellow(' This can cause issues if this environment is a production environment!'));
                    console.log('');
                    console.log(chalk.yellow('To enable Authentication mode, set the ') + chalk.bold(chalk.green('authentication')) + chalk.yellow(' variable in the config to ') + chalk.bold(chalk.green('true')) + chalk.yellow('!'));
                };
                console.log('');
                console.log('=======================');
                console.log('');
            };

            portal.api(args)
            .then(portal.socket, null)
            .then(portal.database, null)
            .then(args => {
                console.log('Websocket Running on port: ', args.settings.websocket.port);
                console.log('Webserver Running on port: ', args.settings.localwebserver.port);
            }, err => {
                console.log('Error Initializing: ', err);
            });
        },

        socket: (args) => {
            var deferred = Q.defer();

            socket.start(args).then(res => {
                deferred.resolve(args);
            }, err => {
                deferred.reject(err);
            });

            return deferred.promise;
        },

        database: (args) => {
            var deferred = Q.defer();

            db.connect().then(database => {
                global.__database = database;
                deferred.resolve(args);
            }, err => {
                deferred.reject(err);
            });

            return deferred.promise;
        }
    };

    portal.init({
        'settings': __settings
    });
} catch(error) {
    console.log('The following error has occurred: ', error.message);
};