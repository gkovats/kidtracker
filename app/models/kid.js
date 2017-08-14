/**
 * Kid model
 */

var Sequelize   = require('sequelize');     
var db          = require('../lib/db');         // Sequelize DB instance
var logger      = require('../lib/logger');     // Logger instance
var validator   = require('validator');         // https://www.npmjs.com/package/validator
var AppError    = require('../lib/appError');   // custom error class
var utils       = require('../lib/utils');      // utility library

// define errors 
const ERR_GENERAL           = 1100;
const ERR_BAD_EMAIL         = 1101;
const ERR_DUPLICATE_EMAIL   = 1103;
const ERR_BAD_ID            = 1105;
const ERR_BAD_COUNT         = 1107;
const ERR_BAD_START         = 1109;
const ERR_BAD_FIELD         = 1111;
const ERR_BAD_ORDER         = 1113;
const ERR_NOT_FOUD          = 1115;
const ERR_MISSING_FAMILY_ID = 1117;


/**

CREATE TABLE `Kid` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `createdBy` int(11) unsigned DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `familyId` int(11) unsigned DEFAULT NULL,
  `birthday` datetime DEFAULT NULL,
  `age` tinyint(4) DEFAULT NULL,
  `icon` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `family` (`familyId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

 */

var Kid = db.define('Kid', {
    createdBy       : {
        type            : Sequelize.INTEGER
    },
    name            : { 
        type            : Sequelize.STRING(250), 
        allowNull       : false
    },
    familyId        : {
        type            : Sequelize.INTEGER, 
        allowNull       : false
    },
    birthday        : {
        type            : Sequelize.DATE
    },
    age             : {
        type            : Sequelize.INTEGER
    },
    icon            : { 
        type            : Sequelize.STRING(10)
    }
},{
    freezeTableName: true,
    tableName: 'Kid'
});

exports.updateableFields = ['name', 'familyId', 'birthday', 'age', 'icon'];
exports.publicFields = ['id', 'name', 'familyId', 'birthday', 'age', 'icon'];
exports.orderField = 'name';

/**
 * Perform creation of this table
 */
exports.install = function() {
    return Kid.sync();
};

/**
 * Get kids
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

        Kid.findAll({
            offset: start, 
            limit: count,
            order: [[orderby, order]]
        }).then(function(kids){
            if (!kids) {
                return reject(new AppError("No kids found.", ERR_GENERAL));
            }
            return resolve(kids);
        }).catch(function(err){
            return reject(new AppError(err.name + ": " + err.message, err.code || ERR_GENERAL));
        });
        
    });
    
};

/**
 * Insert Kid
 */
exports.get = function(id) {
    
    id = parseInt(id);
    return new Promise(function(resolve, reject){
        
        // some checks
        if (isNaN(id) || typeof id !== 'number' || id < 1) {
            return reject(new AppError("Kid id isn't valid.", ERR_BAD_ID));
        }

        // kid must exist
        Kid.findOne({
            where: {id: id}
        }).then(function(kid){
            if (!kid) {
                return reject(new AppError(utils.sprintf("No kid found by id %d.", id), ERR_NOT_FOUD));
            }
            return resolve(kid);
        }).catch(function(err){
            return reject(new AppError(err.name + ": " + err.message, err.code || ERR_GENERAL));
        });
        
    });
    
};

/**
 * Insert Kid
 */
exports.insert = function(data) {
    
    return new Promise(function(resolve, reject){
        
        // some checks
        if (!data.familyId) {
            return reject(new AppError("Family ID must be supplied.", ERR_MISSING_FAMILY_ID));
        }

        Kid.create(data).then(function(kid){
            return resolve(kid);
        }).catch(function(err){
            return reject(new AppError(err.name + ": " + err.message, err.code || ERR_GENERAL));
        });
    });
          
};

/**
 * Update a kid record
 * 
 * @param number id   Kid ID 
 * @param object data Array of fields to update
 * @returns Promise
 */
exports.update = function(id, data) {
    
    return new Promise(function(resolve, reject){
        
        Kid.count({
            where: {
                id: id
            }
        }).then(function(count){
            // if we didn't find the requested kid, reject
            if (!count) {
                return reject(new AppError(utils.sprintf("No kid found by id %d.", id), ERR_NOT_FOUD));
            }
            return Kid.update(data, {
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
 * Delete a kid record
 * 
 * @param number id   Kid ID 
 * @param object data Array of fields to update
 * @returns Promise
 */
exports.delete = function(id, data) {
    
    return new Promise(function(resolve, reject){
        
        // kid must exist
        Kid.count({
            where: {
                id: id
            }
        }).then(function(count){
            // if no kid found, can't delete
            if (!count) {
                return reject(new AppError(utils.sprintf("No kid found by id %d.", id), ERR_NOT_FOUD));
            }
            return Kid.destroy({
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
        return Kid.create(data, {transaction: t});

    }).then(function (result) {
        
        logger.info('Model kid insert passed: ');
        
        return callback(result);
        // Transaction has been committed
        // result is whatever the result of the promise chain returned to the
        // transaction callback
    }).catch(function (err) {
        
        logger.info('Model kid insert failed: ');
        return callback(err);
        // Transaction has been rolled back
        // err is whatever rejected the promise chain returned to the
        // transaction callback
    });
*/




