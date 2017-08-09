var config  = require('config');
var winston = require('winston');

winston.level = config.logger.level || 'debug';

console.info("LOGGER: ", config);

// return winston instance
module.exports = winston;

