var config  = require('config'),    
    express = require('express'),   // https://expressjs.com/
    app     = express();




console.info(config);
console.info(config.port);

var config          = require('config');            // https://www.npmjs.com/package/config
var express         = require('express');           // https://expressjs.com/
var app             = express();                    // Express app
var morgan          = require('morgan');            // log requests to the console (express4)
var bodyParser      = require('body-parser');       // pull information from HTML POST (express4)
var methodOverride  = require('method-override');   // simulate DELETE and PUT (express4)
var server;


// configuration ===============================================================

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());     
app.use(express.errorHandler({ 
    dumpExceptions: true, 
    showStack   : true }));

// Invoke server
// @TODO: Gracefully fail when port is busy
// TODO: Test 1 2 3

server = app.listen(config.port, function () {
    console.log('Example app listening on port ' + config.port + '!')
})


//catches ctrl+c event
process.on('SIGINT', function() {
    console.log('Closing server.');
    server.close();
    process.exit();
});
