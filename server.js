/*
Here is where you set up your server file.
express middleware.
*/

var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
global.db = require('./models');

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static(process.cwd() + '/public'));

app.use(bodyParser.urlencoded({
	extended: false
}));
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({
	defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Routing
var routes = require('./controllers/router');
app.use('/', routes);

// Socket io
var socketio = require('./controllers/socketio');
io.on('connection', socketio.connection);

// Port
var PORT = process.env.PORT || 3000;

// sync with sequelize and start listening
db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0')
.then(function() {
    return db.sequelize.sync({
        force: true
    })
}).then(function() {
    app.listen(PORT, function() {
        console.log("Server running on port %s", PORT);
    });
});
