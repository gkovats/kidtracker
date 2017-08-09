var config  = require('config');
var winston = require('winston');

winston.level = config.logger.level || 'debug';

// return winston instance
module.exports = winston;

