/**
 * User controller
 */

var env         = process.env.NODE_ENV || 'development';
var User        = require('../models/user');
var logger      = require('../lib/logger');
var controller  = require('./base');

/**
 * Get users
 */
exports.index = function(req, res, next) {

    User.index(req.query.count, req.query.start, req.query.orderby, req.query.order).then(function(user){
        return res.json({
            data: user
        });
    }).catch(function(err){
        return controller.error(res, err);
    });
    
};

/**
 * Get user
 */
exports.get = function(req, res, next) {
    
    User.get(req.params.id).then(function(user){
        return res.json({
            data: user
        });
    }).catch(function(err){
        return controller.error(res, err);
    });
    
};

/**
 * Create user
 */
exports.insert = function(req, res, next) {
    
    User.insert(req.body).then(function(result){
        return res.json({
            msg: result
        });
    }).catch(function(err){
        return controller.error(res, err);
    });
    
};
