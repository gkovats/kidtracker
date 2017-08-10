/**
 * User model
 */

var Sequelize   = require('sequelize');     
var db          = require('../lib/db');         // Sequelize DB instance
var logger      = require('../lib/logger');     // Logger instance
var validator   = require('validator');         // https://www.npmjs.com/package/validator
var AppError    = require('../lib/appError');   // custom error class
var utils       = require('../lib/utils');      // utility library
var _           = require('underscore');        // utility library

// define errors 
const ERR_GENERAL           = 1000;
const ERR_BAD_EMAIL         = 1001;
const ERR_DUPLICATE_EMAIL   = 1003;
const ERR_BAD_ID            = 1005;
const ERR_BAD_COUNT         = 1007;
const ERR_BAD_START         = 1009;
const ERR_BAD_FIELD         = 1011;
const ERR_BAD_ORDER         = 1013;


var User = db.define('User', {
    id      : {
        primaryKey      : true,
        type            : Sequelize.INTEGER, 
        allowNull       : false, 
        autoIncrement   : true
    },
    name    : { 
        type            : Sequelize.STRING(250), 
        allowNull       : false
    },
    email   : { 
        type            : Sequelize.STRING(250), 
        allowNull       : false
    },
    emailConfirm : { 
        type            : Sequelize.STRING(6)
    },
    hash    : { 
        type            : Sequelize.STRING(32)
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

exports.publicFields = ['id', 'name', 'email'];
exports.orderField = 'name';

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
        if (_.indexOf(exports.publicFields, orderby) < 0) {
            return reject(new AppError("Orderby field not valid.", ERR_BAD_FIELD));
        }
        if (_.indexOf(['ASC', 'DESC'], order) < 0) {
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
            attributes : exports.publicFields, // only return public fields
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
            attributes : publicFields, // only return public fields
            where: {id: id}
        }).then(function(user){
            if (!user) {
                return reject(new AppError(utils.sprintf("No user found by id %d.", id), ERR_GENERAL));
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
        }).then(function(result){
            return resolve(utils.sprintf("User '%s' created.", data.email));
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




