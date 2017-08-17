/**
 * User model
 */

var Sequelize   = require('sequelize');     
var db          = require('../lib/db');         // Sequelize DB instance
var logger      = require('../lib/logger');     // Logger instance
var validator   = require('validator');         // https://www.npmjs.com/package/validator
var AppError    = require('../lib/appError');   // custom error class
var utils       = require('../lib/utils');      // utility library

// define errors 
const ERR_GENERAL           = 1000;
const ERR_BAD_EMAIL         = 1001;
const ERR_DUPLICATE_EMAIL   = 1003;
const ERR_BAD_ID            = 1005;
const ERR_BAD_COUNT         = 1007;
const ERR_BAD_START         = 1009;
const ERR_BAD_FIELD         = 1011;
const ERR_BAD_ORDER         = 1013;
const ERR_NOT_FOUD          = 1015;


var User = db.define('User', {
    name    : { 
        type            : Sequelize.STRING(250), 
        allowNull       : false
    },
    email   : { 
        type            : Sequelize.STRING(250),
        validate        : {
            isEmail     : true,
        },
        allowNull       : false
    },
    emailConfirm : { 
        type            : Sequelize.STRING(6),
        validate        : {
            isAlphanumeric  : true
        }
    },
    hash    : { 
        type            : Sequelize.STRING(32),
        validate        : {
            isAlphanumeric  : true
        }
    },
    familyId : { 
        type            : Sequelize.INTEGER
    },
    status  : { 
        type            : Sequelize.INTEGER,
        allowNull       : false, 
        defaultValue    : 0
    },
    loginAttempts  : { 
        type            : Sequelize.INTEGER,
        defaultValue    : 0
    }
},{
    freezeTableName: true,
    tableName: 'User'
});

exports.updateableFields = ['name', 'email', 'status'];
exports.publicFields = ['id', 'name', 'email', 'familyId', 'status'];
exports.orderField = 'name';

/**
 * Perform creation of this table
 */
exports.install = function() {
    return User.sync();
};

/**
 * Get users
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

        // email must be unique
        User.findAll({
            offset: start, 
            limit: count,
            order: [[orderby, order]]
        }).then(function(users){
            if (!users) {
                return reject(new AppError("No users found.", ERR_GENERAL));
            }
            return resolve(users);
        }).catch(function(err){
            return reject(new AppError(err.name + ": " + err.message, err.code || ERR_GENERAL));
        });
        
    });
    
};

/**
 * Insert User
 */
exports.get = function(id) {
    
    id = parseInt(id);
    return new Promise(function(resolve, reject){
        
        // some checks
        if (isNaN(id) || typeof id !== 'number' || id < 1) {
            return reject(new AppError("User id isn't valid.", ERR_BAD_ID));
        }

        // email must be unique
        User.findOne({
            where: {id: id}
        }).then(function(user){
            if (!user) {
                return reject(new AppError(utils.sprintf("No user found by id %d.", id), ERR_NOT_FOUD));
            }
            return resolve(user);
        }).catch(function(err){
            return reject(new AppError(err.name + ": " + err.message, err.code || ERR_GENERAL));
        });
        
    });
    
};

/**
 * Insert User
 */
exports.insert = function(data) {
    
    return new Promise(function(resolve, reject){
        
        // some checks
        if (!validator.isEmail(data.email)) {
            return reject(new AppError(
                "Email is not a valid address.", 
                ERR_BAD_EMAIL
            ));
        }
        
        // email must be unique
        User.count({
            where: {
                email: data.email
            }
        }).then(function(count){
            // if we've got matching emails, reject
            if (count) {
                return reject(new AppError(
                    "Email is already in use. Please log in with your existing account.", 
                    ERR_BAD_EMAIL
                ));
            }
            return User.create(data);
        }).then(function(user){
            return resolve(user);
        }).catch(function(err){
            return reject(new AppError(err.name + ": " + err.message, err.code || ERR_GENERAL));
        });
    });
          
};

/**
 * Update a user record
 * 
 * @param number id   User ID 
 * @param object data Array of fields to update
 * @returns Promise
 */
exports.update = function(id, data) {
    
    return new Promise(function(resolve, reject){
        
        // some checks
        if (!validator.isEmail(data.email)) {
            return reject(new AppError(
                    "Email is not a valid address.", 
                    ERR_BAD_EMAIL
            ));
        }
        
        // email must be unique
        User.count({
            where: {
                id: id
            }
        }).then(function(count){
            // if we've got matching emails, reject
            if (!count) {
                return reject(new AppError(utils.sprintf("No user found by id %d.", id), ERR_NOT_FOUD));
            }
            return User.update(data, {
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
 * Delete a user record
 * 
 * @param number id   User ID 
 * @param object data Array of fields to update
 * @returns Promise
 */
exports.delete = function(id, data) {
    
    return new Promise(function(resolve, reject){
        
        // user must exist
        User.count({
            where: {
                id: id
            }
        }).then(function(count){
            // if no user found, can't delete
            if (!count) {
                return reject(new AppError(utils.sprintf("No user found by id %d.", id), ERR_NOT_FOUD));
            }
            return User.destroy({
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
        return User.create(data, {transaction: t});

    }).then(function (result) {
        
        logger.info('Model user insert passed: ');
        
        return callback(result);
        // Transaction has been committed
        // result is whatever the result of the promise chain returned to the
        // transaction callback
    }).catch(function (err) {
        
        logger.info('Model user insert failed: ');
        return callback(err);
        // Transaction has been rolled back
        // err is whatever rejected the promise chain returned to the
        // transaction callback
    });
*/




