const Q = require('q');
const db = require('./db/mongo');
const auth = require('./lib/auth');
const cors = require('cors');
const http = require('http');
const chalk = require('chalk');
const socket = require('./lib/socket');
const express = require('express');
const responder = require('./lib/responder');
const bodyParser = require('body-parser');
const healthcheck = require('@bitid/health-check');
const ErrorResponse = require('./lib/error-response');

global.__base = __dirname + '/';
global.__logger = require('./lib/logger');
global.__sockets = [];
global.__settings = require('./config.json');
global.__responder = new responder.module();

try {
    var portal = {
        api: (args) => {
            var deferred = Q.defer();

            try {
                var app = express();
                app.use(cors());
                app.use(bodyParser.urlencoded({
                    'limit': '50mb',
                    'extended': true
                }));
                app.use(bodyParser.json({
                    'limit': '50mb'
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
                __logger.init('Loaded: /api/logger')

                app.use('/health-check', healthcheck);
                __logger.init('Loaded: /health-check')

                app.use((error, req, res, next) => {
                    var err = new ErrorResponse();
                    err.error.code = 500;
                    err.error.message = 'Something broke';
                    err.error.errors[0].code = 500;
                    err.error.errors[0].message = 'Something broke';
                    err.hiddenErrors.push(err.stack);
                    __responder.error(req, res, err);
                });

                var server = http.createServer(app);
                server.listen(args.settings.localwebserver.port);
                deferred.resolve(args);
            } catch (err) {
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
                    console.log(chalk.yellow(index + ': You are running in ') + chalk.red('Development Mode!') + chalk.yellow(' This can cause issues if this environment is a production environment!'));
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

            portal.logger(args)
                .then(portal.api, null)
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

        logger: (args) => {
            var deferred = Q.defer();

            __logger.init();
            deferred.resolve(args);

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
} catch (error) {
    console.log('The following error has occurred: ', error.message);
};