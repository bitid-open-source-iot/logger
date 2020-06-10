// const log4js = require('log4js');
var logger;

var module = function() {
    return {
        log: (error, debug) => {
            try {
                // if (error != '') {
                //     logger.error(error);
                // } else {
                //     logger.debug(debug);
                // };
                console.log(error, debug);
                return;
            } catch(e) {
                console.log('Error in writeLog');
            };
        },
        init: (settings) => {
            // log4js.configure(settings);
            // logger = log4js.getLogger("file-appender");
        }
    };
};

exports.module = module;