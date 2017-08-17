var Sequelize   = require('sequelize');
var config      = require('config');
var dbOptions   = {dialect: "mysql", timestamps: true};
var dbConfig    = config.get('api.db');


if (config.has('api.db.host')) {
    dbOptions.host = config.get('api.db.host');
}

module.exports = new Sequelize(config.db.dbname, config.db.user, config.db.password, dbOptions);
