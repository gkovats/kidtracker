/**
 * Action controller
 */

var env         = process.env.NODE_ENV || 'development';
var Action      = require('../models/action');
var logger      = require('../lib/logger');
var controller  = require('./base');
var utils       = require('../lib/utils');      // utility library

/**
 * Get actions
 */
exports.index = function(req, res, next) {

    Action.index(req.query.count, req.query.start, req.query.orderby, req.query.order).then(function(actions){
        // return only public fields
        var i = 0;
        for (i; i < actions.length; i++) {
            actions[i] = controller.cleanData(actions[i].dataValues, Action.publicFields);
        } 
        return res.json({
            success: true,
            data: actions
        });
    }).catch(function(err){
        return controller.error(res, err);
    });
    
};

/**
 * Get action
 */
exports.get = function(req, res, next) {
    Action.get(req.params.id).then(function(action){
        return res.json({
            success: true,
            data: action
        });
    }).catch(function(err){
        return controller.error(res, err);
    });
    
};

/**
 * Create action
 */
exports.insert = function(req, res, next) {
    var data = controller.cleanData(req.body, Action.updateableFields);
    Action.insert(data).then(function(action){
        return res.json({
            success : true,
            msg     : utils.sprintf("Action '%s' was successfully created.", action.name),
            data    : controller.cleanData(action.dataValues, Action.publicFields)
        });
    }).catch(function(err){
        return controller.error(res, err);
    });
    
};

/**
 * Update action
 */
exports.update = function(req, res, next) {
    var data = controller.cleanData(req.body, Action.updateableFields);
    Action.update(req.params.id, data).then(function(action){
        return res.json({
            success : true,
            msg     : utils.sprintf("Action '%d' has been udpated.", req.params.id)
        });
    }).catch(function(err){
        return controller.error(res, err);
    });
    
};

/**
 * Delete action
 */
exports.delete = function(req, res, next) {
    Action.delete(req.params.id).then(function(action){
        return res.json({
            success : true,
            msg     : utils.sprintf("Action '%d' has been deleted.", req.params.id)
        });
    }).catch(function(err){
        return controller.error(res, err);
    });
    
};
