var Sequelize   = require('sequelize');
var db          = require('../lib/db');

var User = db.define('user', {
    username: Sequelize.STRING,
    birthday: Sequelize.DATE,
    test: Sequelize.TEXT
});

module.exports = User;