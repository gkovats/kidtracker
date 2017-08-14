/**
 * User controller
 */

var env         = process.env.NODE_ENV || 'development';
var User        = require('../models/user');
var logger      = require('../lib/logger');
var controller  = require('./base');
var utils       = require('../lib/utils');      // utility library


/**
 * Get users
 */
exports.index = function(req, res, next) {

    User.index(req.query.count, req.query.start, req.query.orderby, req.query.order).then(function(user){
        return res.json({
            success: true,
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
            success: true,
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
    var data = controller.cleanData(req.body, User.publicFields);
    User.insert(data).then(function(user){
        return res.json({
            success : true,
            msg     : utils.sprintf("User '%s' was successfully created.", user.email),
            data    : user.id
        });
    }).catch(function(err){
        return controller.error(res, err);
    });
    
};

/**
 * Update user
 */
exports.update = function(req, res, next) {
    var data = controller.cleanData(req.body, User.publicFields);
    User.update(req.params.id, data).then(function(user){
        return res.json({
            success : true,
            msg     : utils.sprintf("User '%d' has been udpated.", req.params.id)
        });
    }).catch(function(err){
        return controller.error(res, err);
    });
    
};

/**
 * Delete user
 */
exports.delete = function(req, res, next) {
    User.delete(req.params.id).then(function(user){
        return res.json({
            success : true,
            msg     : utils.sprintf("User '%d' has been deleted.", req.params.id)
        });
    }).catch(function(err){
        return controller.error(res, err);
    });
    
};
