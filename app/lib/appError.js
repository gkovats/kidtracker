/**
 * Utility Error for sending message and code
 */

var logger      = require('../lib/logger');     // Logger instance

module.exports = class AppError {
    constructor (message, code) {
  
        this.message = message;
        this.code = "E" + code || "E4000";
        logger.error("AppError: " + message + " [" + this.code + "]");
    }
};