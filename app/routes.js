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
    // @TODO: add authentication, ME routes
    app.get('/users', user.index);
    app.get('/user/:id', user.get);
    app.post('/user', user.insert);
    app.post('/user/:id', user.update);
    app.delete('/user/:id', user.delete);
    
};
