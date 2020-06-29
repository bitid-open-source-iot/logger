var chai            = require('chai');
var chaiSubset      = require('chai-subset');
chai.use(chaiSubset);

var Q       = require('q');
var fetch   = require('node-fetch');
var assert  = require('chai').assert;
var expect  = require('chai').expect;
var should  = require('chai').should();
var config  = require('./config.json');

var loggerId = null;

describe('Logger', function() {
    it('/api/logger/add', function(done) {
        this.timeout(5000);

        tools.api.logger.add()
        .then((result) => {
            try {
                loggerId = result.loggerId;
                result.should.have.property('loggerId');
                done();
            } catch(e) {
                done(e);
            };
        }, (err) => {
            try {
                done(err);
            } catch(e) {
                done(e);
            };
        });
    });

    it('/api/logger/get', function(done) {
        this.timeout(5000);

        tools.api.logger.get()
        .then((result) => {
            try {
                result.should.have.property('role');
                result.should.have.property('users');
                result.should.have.property('loggerId');
                result.should.have.property('whitelist');
                result.should.have.property('serverDate');
                result.should.have.property('description');
                result.should.have.property('organizationOnly');
                done();
            } catch(e) {
                done(e);
            };
        }, (err) => {
            try {
                done(err);
            } catch(e) {
                done(e);
            };
        });
    });

    it('/api/logger/list', function(done) {
        this.timeout(5000);

        tools.api.logger.list()
        .then((result) => {
            try {
                result[0].should.have.property('role');
                result[0].should.have.property('users');
                result[0].should.have.property('loggerId');
                result[0].should.have.property('whitelist');
                result[0].should.have.property('serverDate');
                result[0].should.have.property('description');
                result[0].should.have.property('organizationOnly');
                done();
            } catch(e) {
                done(e);
            };
        }, (err) => {
            try {
                done(err);
            } catch(e) {
                done(e);
            };
        });
    });

    it('/api/logger/update', function(done) {
        this.timeout(5000);

        tools.api.logger.update()
        .then((result) => {
            try {
                result.should.have.property('updated');
                expect(result.updated).to.equal(1);
                done();
            } catch(e) {
                done(e);
            };
        }, (err) => {
            try {
                done(err);
            } catch(e) {
                done(e);
            };
        });
    });

    it('/api/logger/share', function(done) {
        this.timeout(5000);

        tools.api.logger.share()
        .then((result) => {
            try {
                result.should.have.property('updated');
                expect(result.updated).to.equal(1);
                done();
            } catch(e) {
                done(e);
            };
        }, (err) => {
            try {
                done(err);
            } catch(e) {
                done(e);
            };
        });
    });

    it('/api/logger/updatesubscriber', function(done) {
        this.timeout(5000);

        tools.api.logger.updatesubscriber()
        .then((result) => {
            try {
                result.should.have.property('updated');
                expect(result.updated).to.equal(1);
                done();
            } catch(e) {
                done(e);
            };
        }, (err) => {
            try {
                done(err);
            } catch(e) {
                done(e);
            };
        });
    });

    it('/api/logger/unsubscribe', function(done) {
        this.timeout(5000);

        tools.api.logger.unsubscribe()
        .then((result) => {
            try {
                result.should.have.property('updated');
                expect(result.updated).to.equal(1);
                done();
            } catch(e) {
                done(e);
            };
        }, (err) => {
            try {
                done(err);
            } catch(e) {
                done(e);
            };
        });
    });

    it('/api/logger/write', function(done) {
        this.timeout(5000);

        tools.api.logger.write()
        .then((result) => {
            try {
                result.should.have.property('historicalId');
                done();
            } catch(e) {
                done(e);
            };
        }, (err) => {
            try {
                done(err);
            } catch(e) {
                done(e);
            };
        });
    });

    it('/api/logger/historical', function(done) {
        this.timeout(5000);

        tools.api.logger.historical()
        .then((result) => {
            try {
                result[0].should.have.property('data');
                result[0].should.have.property('date');
                result[0].should.have.property('catagory');
                result[0].should.have.property('loggerId');
                result[0].should.have.property('historicalId');
                done();
            } catch(e) {
                done(e);
            };
        }, (err) => {
            try {
                done(err);
            } catch(e) {
                done(e);
            };
        });
    });

    it('/api/logger/delete', function(done) {
        this.timeout(5000);

        tools.api.logger.delete()
        .then((result) => {
            try {
                result.should.have.property('deleted');
                expect(result.deleted).to.equal(1);
                done();
            } catch(e) {
                done(e);
            };
        }, (err) => {
            try {
                done(err);
            } catch(e) {
                done(e);
            };
        });
    });
});

describe('Health Check', function() {
    it('/', function(done) {
        this.timeout(5000);

        tools.api.healthcheck()
        .then((result) => {
            try {
                result.should.have.property('uptime');
                result.should.have.property('memory');
                result.should.have.property('database');
                done();
            } catch(e) {
                done(e);
            };
        }, (err) => {
            try {
                done(err);
            } catch(e) {
                done(e);
            };
        });
    });
});

var tools = {
    api: {
        logger: {
            add: async () => {
                var deferred = Q.defer();
                
                const response = await tools.post('/api/logger/add', {
                    'whitelist': {
                        'hosts':    ['127.0.0.1'],
                        'enabled':  true
                    },
                    'description':      'xxx',
                    'organizationOnly': 0
                });

                deferred.resolve(response);

                return deferred.promise;
            },
            get: async () => {
                var deferred = Q.defer();

                const response = await tools.post('/api/logger/get', {
                    'filter': [
                        'role',
                        'users',
                        'loggerId',
                        'whitelist',
                        'serverDate',
                        'description',
                        'organizationOnly'
                    ],
                    'loggerId': loggerId
                });

                deferred.resolve(response);

                return deferred.promise;
            },
            list: async () => {
                var deferred = Q.defer();
                
                const response = await tools.post('/api/logger/list', {
                    'filter': [
                        'role',
                        'users',
                        'loggerId',
                        'whitelist',
                        'serverDate',
                        'description',
                        'organizationOnly'
                    ],
                    'loggerId': loggerId
                });

                deferred.resolve(response);

                return deferred.promise;
            },
            share: async () => {
                var deferred = Q.defer();
                
                const response = await tools.post('/api/logger/share', {
                    'role':     4,
                    'email':    'shared@email.com',
                    'loggerId': loggerId,
                });

                deferred.resolve(response);

                return deferred.promise;
            },
            write: async () => {
                var deferred = Q.defer();
                
                const response = await tools.put('/api/logger/write', {
                    'data': {
                        'test': 'success'
                    },
                    'catagory': 'test',
                    'loggerId': loggerId
                });

                deferred.resolve(response);

                return deferred.promise;
            },
            update: async () => {
                var deferred = Q.defer();
                
                const response = await tools.post('/api/logger/update', {
                    'title':    'test update',
                    'loggerId': loggerId
                });

                deferred.resolve(response);

                return deferred.promise;
            },
            delete: async () => {
                var deferred = Q.defer();
                
                const response = await tools.post('/api/logger/delete', {
                    'loggerId': loggerId,
                });

                deferred.resolve(response);

                return deferred.promise;
            },
            historical: async () => {
                var deferred = Q.defer();
                
                const response = await tools.post('/api/logger/historical', {
                    'filter': [
                        'data',
                        'date',
                        'catagory',
                        'loggerId',
                        'historicalId'
                    ],
                    'loggerId': loggerId
                });

                deferred.resolve(response);

                return deferred.promise;
            },
            unsubscribe: async () => {
                var deferred = Q.defer();
                
                const response = await tools.post('/api/logger/unsubscribe', {
                    'email':    'shared@email.com',
                    'loggerId': loggerId
                });

                deferred.resolve(response);

                return deferred.promise;
            },
            updatesubscriber: async () => {
                var deferred = Q.defer();
                
                const response = await tools.post('/api/logger/updatesubscriber', {
                    'role':     2,
                    'email':    'shared@email.com',
                    'loggerId': loggerId
                });

                deferred.resolve(response);

                return deferred.promise;
            }
        },
        healthcheck: async () => {
            var deferred = Q.defer();
            
            const response = await tools.put('/health-check', {});

            deferred.resolve(response);

            return deferred.promise;
        }
    },
    put: async (url, payload) => {
        var deferred = Q.defer();

        payload.header = {
            'email':           config.email, 
            'appId':    config.appId
        };

        payload = JSON.stringify(payload);

        const response = await fetch(config.api + url, {
            'headers': {
                'Accept':           '*/*',
                'Referer':          '127.0.0.1',
                'Content-Type':     'application/json; charset=utf-8',
                'Authorization':    JSON.stringify(config.token),
                'Content-Length':   payload.length
            },
            'body':   payload,
            'method': 'PUT'
        });
        
        const result = await response.json();

        deferred.resolve(result);
        
        return deferred.promise;
    },
    post: async (url, payload) => {
        var deferred = Q.defer();

        payload.header = {
            'email':           config.email, 
            'appId':    config.appId
        };

        payload = JSON.stringify(payload);

        const response = await fetch(config.api + url, {
            'headers': {
                'Accept':           '*/*',
                'Referer':          '127.0.0.1',
                'Content-Type':     'application/json; charset=utf-8',
                'Authorization':    JSON.stringify(config.token),
                'Content-Length':   payload.length
            },
            'body':   payload,
            'method': 'POST'
        });
        
        const result = await response.json();

        deferred.resolve(result);
        
        return deferred.promise;
    }
};