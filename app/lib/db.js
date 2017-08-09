var Sequelize   = require('sequelize');
var config      = require('config');
var sequelize   = new Sequelize(config.db.dbname, config.db.user, config.db.password, {"dialect": "mysql"});

module.exports = sequelize;
