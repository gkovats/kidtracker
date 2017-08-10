var Sequelize   = require('sequelize');
var config      = require('config');
var dbOptions   = {dialect: "mysql", timestamps: true};

if (config.db.host) {
    dbOptions.host = config.db.host; 
}

module.exports = new Sequelize(config.db.dbname, config.db.user, config.db.password, dbOptions);
