/**
 * Family controller
 */

var env         = process.env.NODE_ENV || 'development';
var Family      = require('../models/family');
var logger      = require('../lib/logger');
var controller  = require('./base');
var utils       = require('../lib/utils');      // utility library


/**
 * Get families
 */
exports.index = function(req, res, next) {

    Family.index(req.query.count, req.query.start, req.query.orderby, req.query.order).then(function(families){
        // return only public fields
        var i = 0;
        for (i; i < families.length; i++) {
            families[i] = controller.cleanData(families[i].dataValues, Family.publicFields);
        } 
        return res.json({
            success: true,
            data: families
        });
    }).catch(function(err){
        return controller.error(res, err);
    });
    
};

/**
 * Get family
 */
exports.get = function(req, res, next) {
    Family.get(req.params.id).then(function(family){
        return res.json({
            success: true,
            data: family
        });
    }).catch(function(err){
        return controller.error(res, err);
    });
    
};

/**
 * Create family
 */
exports.insert = function(req, res, next) {
    var data = controller.cleanData(req.body, Family.updateableFields);
    Family.insert(data).then(function(family){
        return res.json({
            success : true,
            msg     : utils.sprintf("Family '%s' was successfully created.", family.name),
            data    : controller.cleanData(family.dataValues, Family.publicFields)
        });
    }).catch(function(err){
        return controller.error(res, err);
    });
    
};

/**
 * Update family
 */
exports.update = function(req, res, next) {
    var data = controller.cleanData(req.body, Family.updateableFields);
    Family.update(req.params.id, data).then(function(family){
        return res.json({
            success : true,
            msg     : utils.sprintf("Family '%d' has been udpated.", req.params.id)
        });
    }).catch(function(err){
        return controller.error(res, err);
    });
    
};

/**
 * Delete family
 */
exports.delete = function(req, res, next) {
    Family.delete(req.params.id).then(function(family){
        return res.json({
            success : true,
            msg     : utils.sprintf("Family '%d' has been deleted.", req.params.id)
        });
    }).catch(function(err){
        return controller.error(res, err);
    });
    
};
