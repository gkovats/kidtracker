/**
 * Controller base, shared features.
 */

var _   = require('underscore'); // utility library


exports.error = function(res, err) {
    return res.status(400).json({
        success : false,
        msg     : err.message,
        code    : err.code
    });
};

/**
 * Given post data, remove all non public fields
 */
exports.cleanData = function(data, publicFields) {
    for (var key in data) {
        if(publicFields.indexOf(key) < 0) {
            delete data[key];
        } else if (typeof data[key] === 'string') {
            data[key] = data[key].trim();
        }
    }
    return data;
};
