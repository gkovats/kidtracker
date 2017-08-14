/**
 * Kid controller
 */

var env         = process.env.NODE_ENV || 'development';
var Kid         = require('../models/kid');
var logger      = require('../lib/logger');
var controller  = require('./base');
var utils       = require('../lib/utils');      // utility library


/**
 * Get kids
 */
exports.index = function(req, res, next) {

    Kid.index(req.query.count, req.query.start, req.query.orderby, req.query.order).then(function(kids){
        // return only public fields
        var i = 0;
        for (i; i < kids.length; i++) {
            kids[i] = controller.cleanData(kids[i].dataValues, Kid.publicFields);
        } 
        return res.json({
            success: true,
            data: kids
        });
    }).catch(function(err){
        return controller.error(res, err);
    });
    
};

/**
 * Get kid
 */
exports.get = function(req, res, next) {
    Kid.get(req.params.id).then(function(kid){
        return res.json({
            success: true,
            data: kid
        });
    }).catch(function(err){
        return controller.error(res, err);
    });
    
};

/**
 * Create kid
 */
exports.insert = function(req, res, next) {
    var data = controller.cleanData(req.body, Kid.updateableFields);
    Kid.insert(data).then(function(kid){
        return res.json({
            success : true,
            msg     : utils.sprintf("Kid '%s' was successfully created.", kid.name),
            data    : controller.cleanData(kid.dataValues, Kid.publicFields)
        });
    }).catch(function(err){
        return controller.error(res, err);
    });
    
};

/**
 * Update kid
 */
exports.update = function(req, res, next) {
    var data = controller.cleanData(req.body, Kid.updateableFields);
    Kid.update(req.params.id, data).then(function(kid){
        return res.json({
            success : true,
            msg     : utils.sprintf("Kid '%d' has been udpated.", req.params.id)
        });
    }).catch(function(err){
        return controller.error(res, err);
    });
    
};

/**
 * Delete kid
 */
exports.delete = function(req, res, next) {
    Kid.delete(req.params.id).then(function(kid){
        return res.json({
            success : true,
            msg     : utils.sprintf("Kid '%d' has been deleted.", req.params.id)
        });
    }).catch(function(err){
        return controller.error(res, err);
    });
    
};
