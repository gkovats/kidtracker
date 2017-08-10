/**
 * Routes definition
 */

module.exports = function attachHandlers(app) {

    var logger = require('./lib/logger');
    var config = require('config');
    
    var user = require('./controllers/user');
    
    logger.info("Loading routes...", config);
    
    app.get('/', function (req, res) {
        res.send('Hello World!');
    });

    // USERS
    app.post('/user', user.insert);
    app.get('/user/:id', user.get);
    app.get('/users', user.index);
    
};
