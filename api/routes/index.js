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
    app.get('/users', user.index);
    app.get('/user/:id', user.get);
    app.post('/user', user.insert);
    app.post('/user/:id', user.update);
    app.delete('/user/:id', user.delete);

    // KIDS
    // @TODO: add authentication, ME routes
    app.get('/kids', kid.index);
    app.get('/kid/:id', kid.get);
    app.post('/kid', kid.insert);
    app.post('/kid/:id', kid.update);
    app.delete('/kid/:id', kid.delete);

    // FAMILIES
    // @TODO: add authentication, ME routes
    app.get('/families', family.index);
    app.get('/family/:id', family.get);
    app.post('/family', family.insert);
    app.post('/family/:id', family.update);
    app.delete('/family/:id', family.delete);

    // ACTIONS
    // @TODO: add authentication, ME routes
    app.get('/actions', action.index);
    app.get('/action/:id', action.get);
    app.post('/action', action.insert);
    app.post('/action/:id', action.update);
    app.delete('/action/:id', action.delete);

    app.all('*', function (req, res) {
        return res.status(400).json({
            success : false,
            msg     : "This is not a supported API route.",
            code    : 0
        });
    });


};
