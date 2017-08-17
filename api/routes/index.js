/**
 * Routes definition
 */

module.exports = function attachHandlers(app) {

    var logger  = require('../lib/logger');
    var config  = require('config');
    var user    = require('../controllers/user');
    var kid     = require('../controllers/kid');
    var action  = require('../controllers/action');
    var family  = require('../controllers/family');
    var system  = require('../controllers/system');

    logger.info("Loading routes...", config);


    // SYSTEM
    // @TODO: add authentication
    app.get('/install', system.install);

    // USERS
    // @TODO: add authentication, ME routes
    app.get('/api/users', user.index);
    app.get('/api/user/:id', user.get);
    app.post('/api/api/user', user.insert);
    app.post('/api/user/:id', user.update);
    app.delete('/api/user/:id', user.delete);

    // KIDS
    // @TODO: add authentication, ME routes
    app.get('/api/kids', kid.index);
    app.get('/api/kid/:id', kid.get);
    app.post('/api/kid', kid.insert);
    app.post('/api/kid/:id', kid.update);
    app.delete('/api/kid/:id', kid.delete);

    // FAMILIES
    // @TODO: add authentication, ME routes
    app.get('/api/families', family.index);
    app.get('/api/family/:id', family.get);
    app.post('/api/family', family.insert);
    app.post('/api/family/:id', family.update);
    app.delete('/api/family/:id', family.delete);

    // ACTIONS
    // @TODO: add authentication, ME routes
    app.get('/api/actions', action.index);
    app.get('/api/action/:id', action.get);
    app.post('/api/action', action.insert);
    app.post('/api/action/:id', action.update);
    app.delete('/api/action/:id', action.delete);

    app.all('*', function (req, res) {
        return res.status(400).json({
            success : false,
            msg     : "This is not a supported API route.",
            code    : 0
        });
    });


};
