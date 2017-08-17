var config          = require('config');            // https://www.npmjs.com/package/config
var express         = require('express');           // https://expressjs.com/
var app             = express();                    // Express app
var morgan          = require('morgan');            // log requests to the console (express4)
var logger          = require('./lib/logger');      // Shared logger
var bodyParser      = require('body-parser');       // pull information from HTML POST (express4)
var methodOverride  = require('method-override');   // simulate DELETE and PUT (express4)
var server;

const PORT          = config.get('api.port') || 3001;

// Express configuration
app.use(express.static(__dirname + '/public'));         // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                 // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));    // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                             // parse JSON

// Logger config
logger.level = config.get('logger.level') || 'info';

// Pull in routes
require('./routes')(app);

// TODO: Gracefully fail when port is busy
server = app.listen(PORT, function () {
    logger.info('Listening on port ' + PORT + '!');
});


// Catch exit and close server
process.on('SIGINT', function() {
    logger.info('Closing server.');
    server.close();
    process.exit();
});
