/**
 * Controller base, shared features.
 */

exports.error = function(res, err) {
    return res.status(400).json({
        msg: err.message,
        code: err.code
    });
};