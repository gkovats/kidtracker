/**
 * Action model
 */

var Sequelize   = require('sequelize');     
var db          = require('../lib/db');         // Sequelize DB instance
var logger      = require('../lib/logger');     // Logger instance
var validator   = require('validator');         // https://www.npmjs.com/package/validator
var AppError    = require('../lib/appError');   // custom error class
var utils       = require('../lib/utils');      // utility library

// define errors 
const ERR_GENERAL           = 1200;
const ERR_BAD_EMAIL         = 1201;
const ERR_DUPLICATE_EMAIL   = 1203;
const ERR_BAD_ID            = 1205;
const ERR_BAD_COUNT         = 1207;
const ERR_BAD_START         = 1209;
const ERR_BAD_FIELD         = 1211;
const ERR_BAD_ORDER         = 1213;
const ERR_NOT_FOUD          = 1215;


/**

CREATE TABLE `Action` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT NULL,
  `actionId` int(11) unsigned NOT NULL,
  `kidId` int(11) unsigned NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `description` varchar(2000) DEFAULT NULL,
  `value` int(11) DEFAULT '0',
  `icon` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`) USING BTREE,
  KEY `action` (`actionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

 */

var Action = db.define('Action', {
    familyId        : {
        type            : Sequelize.INTEGER, 
        allowNull       : false
    },
    kidId           : {
        type            : Sequelize.INTEGER, 
        allowNull       : false
    },
    name            : { 
        type            : Sequelize.STRING(100)
    },
    description     : { 
        type            : Sequelize.STRING(2000)
    },
    value           : { 
        type            : Sequelize.INTEGER, 
        allowNull       : false,
        defaultValue    : 0
    },
    icon            : { 
        type            : Sequelize.STRING(10)
    }
},{
    freezeTableName: true,
    tableName: 'Action'
});

exports.updateableFields = ['familyId', 'kidId', 'name', 'description', 'value', 'icon'];
exports.publicFields = ['id', 'familyId', 'kidId', 'name', 'description', 'value', 'icon'];
exports.orderField = 'name';

/**
 * Perform creation of this table
 */
exports.install = function() {
    return Action.sync();
};

/**
 * Get actions
 */
exports.index = function(count, start, orderby, order) {

    count   = parseInt(count) || 10;
    start   = parseInt(start) || 0;
    order   = (order || 'ASC').toString().toUpperCase();
    orderby = orderby || exports.orderField;
    
    return new Promise(function(resolve, reject){

        // orderby field has to be valid
        if (exports.publicFields.indexOf(orderby) < 0) {
            return reject(new AppError("Orderby field not valid.", ERR_BAD_FIELD));
        }
        if (['ASC', 'DESC'].indexOf(order) < 0) {
            return reject(new AppError("Order value not valid.", ERR_BAD_ORDER));
        }
        
        // some checks
        if (isNaN(count) || typeof count !== 'number' || count < 1) {
            return reject(new AppError("Requested count isn't valid.", ERR_BAD_COUNT));
        }
        if (isNaN(start) || typeof start !== 'number') {
            return reject(new AppError("Requested start isn't valid.", ERR_BAD_START));
        }

        Action.findAll({
            offset: start, 
            limit: count,
            order: [[orderby, order]]
        }).then(function(actions){
            if (!actions) {
                return reject(new AppError("No actions found.", ERR_GENERAL));
            }
            return resolve(actions);
        }).catch(function(err){
            return reject(new AppError(err.name + ": " + err.message, err.code || ERR_GENERAL));
        });
        
    });
    
};

/**
 * Insert Action
 */
exports.get = function(id) {
    
    id = parseInt(id);
    return new Promise(function(resolve, reject){
        
        // some checks
        if (isNaN(id) || typeof id !== 'number' || id < 1) {
            return reject(new AppError("Action id isn't valid.", ERR_BAD_ID));
        }

        // action must exist
        Action.findOne({
            where: {id: id}
        }).then(function(action){
            if (!action) {
                return reject(new AppError(utils.sprintf("No action found by id %d.", id), ERR_NOT_FOUD));
            }
            return resolve(action);
        }).catch(function(err){
            return reject(new AppError(err.name + ": " + err.message, err.code || ERR_GENERAL));
        });
        
    });
    
};

/**
 * Insert Action
 */
exports.insert = function(data) {
    
    return new Promise(function(resolve, reject){
        Action.create(data).then(function(action){
            return resolve(action);
        }).catch(function(err){
            return reject(new AppError(err.name + ": " + err.message, err.code || ERR_GENERAL));
        });
    });
          
};

/**
 * Update a action record
 * 
 * @param number id   Action ID 
 * @param object data Array of fields to update
 * @returns Promise
 */
exports.update = function(id, data) {
    
    return new Promise(function(resolve, reject){
        
        Action.count({
            where: {
                id: id
            }
        }).then(function(count){
            // if we didn't find the requested action, reject
            if (!count) {
                return reject(new AppError(utils.sprintf("No action found by id %d.", id), ERR_NOT_FOUD));
            }
            return Action.update(data, {
                where: {id: id}
            });
        }).then(function(result){
            return resolve(result);
        }).catch(function(err){
            return reject(new AppError(err.name + ": " + err.message, err.code || ERR_GENERAL));
        });
    });
    
};

/**
 * Delete a action record
 * 
 * @param number id   Action ID 
 * @param object data Array of fields to update
 * @returns Promise
 */
exports.delete = function(id, data) {
    
    return new Promise(function(resolve, reject){
        
        // action must exist
        Action.count({
            where: {
                id: id
            }
        }).then(function(count){
            // if no action found, can't delete
            if (!count) {
                return reject(new AppError(utils.sprintf("No action found by id %d.", id), ERR_NOT_FOUD));
            }
            return Action.destroy({
                where: {id: id}
            });
        }).then(function(result){
            return resolve(result);
        }).catch(function(err){
            return reject(new AppError(err.name + ": " + err.message, err.code || ERR_GENERAL));
        });
    });
          
};


/*
    Handling a multiple step transaction... 
    
    return db.transaction(function (t) {

        // chain all your queries here. make sure you return them.
        return Action.create(data, {transaction: t});

    }).then(function (result) {
        
        logger.info('Model action insert passed: ');
        
        return callback(result);
        // Transaction has been committed
        // result is whatever the result of the promise chain returned to the
        // transaction callback
    }).catch(function (err) {
        
        logger.info('Model action insert failed: ');
        return callback(err);
        // Transaction has been rolled back
        // err is whatever rejected the promise chain returned to the
        // transaction callback
    });
*/




