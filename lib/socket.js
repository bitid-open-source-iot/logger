var Q      = require('q');
var wss    = require('websocket').server;
var bll    = require('../bll/bll');
var http   = require('http');
var crypto = require('crypto');

var add = (socket, params) => {
    socket.on('close', (data) => {
        for (var i = global.__sockets.length - 1; i >= 0; i--) {
            if (global.__sockets[i].userId == socket.userId) {
                var now                 = new Date();
                var payload             = global.__sockets[i].data;
                payload.catagory        = "disconnected";
                payload.data.close      = now;
                payload.data.duration   = now - payload.data.open;
                var myModule = new bll.module();
                myModule.logger.socket(payload).then(res => {
                    global.__sockets.splice(i, 1);
                }, err => {
                    global.__sockets.splice(i, 1);
                });
                break;
            };
        };
    });

    global.__sockets.push({
        'data':     params,
        'socket':   socket,
        'userId':   socket.userId
    });
};
/*
    Start Web Socket Server:
    =======================
    Steps:
    1 - Initialize global sockets for easy access throughout application
    2 - Start server on secified port
    3 - Listen for connection
    4 - Authenticate socket if authentication is enabled
    5 - Listen for socket close event in order to automatically remove socket from global sockets
    6 - Add socket to global sockets
*/
exports.start = (args) => {
    var deferred = Q.defer();

    try {
        global.__sockets = [];

        var server = http.createServer();
        server.listen(args.settings.websocket.port);

        var wsServer = new wss({
            'httpServer': server
        });

        wsServer.on('request', (request) => {
            var params = request.resourceURL.query || {};
            var socket = request.accept(null, request.origin);
            try {
                socket.userId = (crypto.randomBytes(Math.ceil(64 / 2)).toString('hex').slice(0, 64));
                var payload = {
                    'data': {
                        'open': new Date()
                    },
                    'catagory': 'connect'
                };
                Object.keys(params).map(key => {
                    if (key == 'loggerId') {
                        payload[key] = params[key];
                    } else {
                        payload.data[key] = params[key];
                    };
                });
                var myModule = new bll.module();
                myModule.logger.socket(payload).then(res => {
                    add(socket, payload);
                }, err => {
                    add(socket, payload);
                });
            } catch(err) {
                socket.close(1007);
            };
        });
        
        deferred.resolve(args);
    } catch(error) {
        deferred.reject(error);
    };
    
    return deferred.promise;
};