/**
 * System actions controller
 */
var User        = require('../models/user');
var Family      = require('../models/family');
var Kid         = require('../models/kid');
var Action      = require('../models/action');
var controller  = require('./base');


/**
 * Install tables
 */
exports.install = function(req, res, next) {
    User.install().then(function() {
        return Family.install(); 
    }).then(function(){
        return Kid.install(); 
    }).then(function(){
        return Action.install(); 
    }).then(function(){
        return res.json({
            success : true,
            msg     : "All tables created"            
        });
    }).catch(function(err){
        return controller.error(res, err);
    });
    
};
