var config          = require('config');            // https://www.npmjs.com/package/config
var express         = require('express');           // https://expressjs.com/
var app             = express();                    // Express app
var morgan          = require('morgan');            // log requests to the console (express4)
var logger          = require('./app/lib/logger');  // Shared logger
var bodyParser      = require('body-parser');       // pull information from HTML POST (express4)
var methodOverride  = require('method-override');   // simulate DELETE and PUT (express4)
var _               = require('underscore');        // utility library
var server;


console.info("COFNIG: ", config);

// Express configuration

app.use(express.static(__dirname + '/public'));         // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                 // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));    // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                             // parse JSON  

// trim whitespace on all POSTed data
app.use(function(req, res, next){
    req.body = _.object(_.map(req.body, function (value, key) {
        return [key, value.trim()];
    }));
    next();
});

// Logger config

logger.level = config.logger.level || 'info';

// Pull in App config
require('./app/routes')(app);

// TODO: Gracefully fail when port is busy
server = app.listen(config.port, function () {
    logger.info('Listening on port ' + config.port + '!');
});


// Catch exit and close server
process.on('SIGINT', function() {
    logger.info('Closing server.');
    server.close();
    process.exit();
});
