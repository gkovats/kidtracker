/**
 * Family model
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

CREATE TABLE `Family` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `timezone` varchar(100) DEFAULT 'EST5EDT',
  `theme` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

 */

var Family = db.define('Family', {
    name            : { 
        type            : Sequelize.STRING(250), 
        allowNull       : false
    },
    timezone        : { 
        type            : Sequelize.STRING(100), 
        allowNull       : false,
        defaultValue    : "EST5EDT"
    },
    theme           : { 
        type            : Sequelize.STRING(10)
    }
},{
    freezeTableName: true,
    tableName: 'Family'
});

exports.updateableFields = ['name', 'timezone', 'theme'];
exports.publicFields = ['id', 'name', 'timezone', 'theme'];
exports.orderField = 'name';

/**
 * Perform creation of this table
 */
exports.install = function() {
    return Family.sync();
};

/**
 * Get families
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

        Family.findAll({
            offset: start, 
            limit: count,
            order: [[orderby, order]]
        }).then(function(families){
            if (!families) {
                return reject(new AppError("No families found.", ERR_GENERAL));
            }
            return resolve(families);
        }).catch(function(err){
            return reject(new AppError(err.name + ": " + err.message, err.code || ERR_GENERAL));
        });
        
    });
    
};

/**
 * Insert Family
 */
exports.get = function(id) {
    
    id = parseInt(id);
    return new Promise(function(resolve, reject){
        
        // some checks
        if (isNaN(id) || typeof id !== 'number' || id < 1) {
            return reject(new AppError("Family id isn't valid.", ERR_BAD_ID));
        }

        // family must exist
        Family.findOne({
            where: {id: id}
        }).then(function(family){
            if (!family) {
                return reject(new AppError(utils.sprintf("No family found by id %d.", id), ERR_NOT_FOUD));
            }
            return resolve(family);
        }).catch(function(err){
            return reject(new AppError(err.name + ": " + err.message, err.code || ERR_GENERAL));
        });
        
    });
    
};

/**
 * Insert Family
 */
exports.insert = function(data) {
    
    return new Promise(function(resolve, reject){
        Family.create(data).then(function(family){
            return resolve(family);
        }).catch(function(err){
            return reject(new AppError(err.name + ": " + err.message, err.code || ERR_GENERAL));
        });
    });
          
};

/**
 * Update a family record
 * 
 * @param number id   Family ID 
 * @param object data Array of fields to update
 * @returns Promise
 */
exports.update = function(id, data) {
    
    return new Promise(function(resolve, reject){
        
        Family.count({
            where: {
                id: id
            }
        }).then(function(count){
            // if we didn't find the requested family, reject
            if (!count) {
                return reject(new AppError(utils.sprintf("No family found by id %d.", id), ERR_NOT_FOUD));
            }
            return Family.update(data, {
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
 * Delete a family record
 * 
 * @param number id   Family ID 
 * @param object data Array of fields to update
 * @returns Promise
 */
exports.delete = function(id, data) {
    
    return new Promise(function(resolve, reject){
        
        // family must exist
        Family.count({
            where: {
                id: id
            }
        }).then(function(count){
            // if no family found, can't delete
            if (!count) {
                return reject(new AppError(utils.sprintf("No family found by id %d.", id), ERR_NOT_FOUD));
            }
            return Family.destroy({
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
        return Family.create(data, {transaction: t});

    }).then(function (result) {
        
        logger.info('Model family insert passed: ');
        
        return callback(result);
        // Transaction has been committed
        // result is whatever the result of the promise chain returned to the
        // transaction callback
    }).catch(function (err) {
        
        logger.info('Model family insert failed: ');
        return callback(err);
        // Transaction has been rolled back
        // err is whatever rejected the promise chain returned to the
        // transaction callback
    });
*/




