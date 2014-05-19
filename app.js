var express = require('express');
var mysql = require('mysql');
var mysqlconfig = require('./mysqlconfig');
var path = require('path');
var connectAssets = require('connect-assets');

/**
 * Create MySQL Server with config data
 */

var db = mysql.createConnection(mysqlconfig.config);

/**
 * Create Express server
 */

var app = express();

/**
 * Express configuration
 */

app.set('port', process.env.PORT || 8080);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(connectAssets({
    paths: ['public/css', 'public/js', 'bower_components'],
    helperContext: app.locals
}));
app.use(express.bodyParser());

/**
 * Controllers
 */

var homeController = require('./controllers/home')();
var personsController = require('./controllers/persons')(db);
var companiesController = require('./controllers/companies')(db);
var apiController = require('./controllers/api')(db);

/**
 * Routes
 */

app.get('/', homeController.index);

app.get('/persons', personsController.index);
app.post('/persons', personsController.addPerson);
app.post('/rmperson', personsController.removePerson);

app.get('/companies', companiesController.index);

app.get('/package', apiController.package);

/**
 * Run server
 */

db.connect(function(err){
    if (err) {
        console.error('✗ MySQL Connection Error. Please make sure MySQL server is running.');
    } else {
        console.log("✔ Successfully connected to MySQL database.");
    }
});

app.listen(app.get('port'), function() {
    console.log("✔ Express server listening on http://localhost:%d", app.get('port'));
});
