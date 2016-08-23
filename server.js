// set up ======================================================================
// get all the tools we need
var express = require('express');
var session  = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var logger = require('morgan');
var methodOverride = require('method-override');
var passport = require('passport');

var app = express();

// Config Passport
require('./config/passport')(passport); // pass passport for configuration

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static(process.cwd() + '/public'));

// Set up middleware
// app.use(favicon(__dirname + '/public/favicon.ico')); // uncomment after placing your favicon in /public
app.use(logger('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({ // body parser for reading body requests
	extended: false
}));
app.use(methodOverride('_method')); // Override with POST having ?_method=DELETE

// Set up view engine
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({
	defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Required for passport
app.use(session({
	secret: 'supersecretpassword',
	resave: true,
	saveUninitialized: true
 } )); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(passport.authenticate('remember-me'));

// Socket io
var server = require('http').Server(app);
var io = require('socket.io')(server);

// Run socket io scripts
require('./controllers/socketio')(io);
//io.on('connection', socketio.connection);


// Routing
var routes = require('./controllers/router')(io);
app.use('/', routes);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
// (no stacktraces leaked to user unless in development environment)
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: (app.get('env') === 'development') ? err : {}
  });
});

module.exports.app = app;
module.exports.server = server;
module.exports.io = io;