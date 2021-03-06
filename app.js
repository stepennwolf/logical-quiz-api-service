var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var serverLogger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var logger = require('./logger');

var dbConfig = require('./config/db');
var routes = require('./routes/index');


// Init Express app
var app = express();
logger.info( "Instantiated Express app" );


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(serverLogger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//init app middleware
app.use( require('./middleware/locale') );

// connect to database
require('./models/db').connect( dbConfig );

// init routes
app.use('/', routes);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});



// error handlers
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    logger.error( err );
    res.status(err.status || 500).end( err.stack );
  });
}



app.use(function(err, req, res, next) {
  logger.error( err );
  res.status(err.status || 500).end();
});



module.exports = app;
