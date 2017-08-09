/**
 * Routes definition
 */

module.exports = function attachHandlers(app) {

    var logger = require('./lib/logger');
    var config = require('config');
    
    var user = require('./models/user');
    
    logger.info("Loading routes...", config);
    
    app.get('/', function (req, res) {
        res.send('Hello World!');
    });
    app.get('/user', function (req, res) {
        res.send('Hey user!');
    });
    
    
};
