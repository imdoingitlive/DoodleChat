// set up ======================================================================
// get all the tools we need
var express = require('express');
var session  = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var methodOverride = require('method-override');
var passport = require('passport');
var flash    = require('connect-flash')

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
//global.db = require('./models');

// Config Passport
require('./config/passport')(passport); // pass passport for configuration

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static(process.cwd() + '/public'));

// Set up middleware
app.use(morgan('dev')); // log every request to the console
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
app.use(flash()); // use connect-flash for flash messages stored in session

// Routing
var routes = require('./controllers/router');
app.use('/', routes);

// Socket io
var socketio = require('./controllers/socketio');
io.on('connection', socketio.connection);

// Port
var PORT = process.env.PORT || 3000;

// sync with sequelize and start listening
// db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0')
// .then(function() {
//     return db.sequelize.sync({
//         force: true
//     })
// }).then(function() {
//     app.listen(PORT, function() {
//         console.log("Server running on port %s", PORT);
//     });
// });

app.listen(PORT, function() {
  console.log("Server running on port %s", PORT);
});