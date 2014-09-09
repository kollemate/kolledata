var express = require('express');
var mysql = require('mysql');
var mysqlconfig = require('./config/mysqlconfig');
var path = require('path');
var connectAssets = require('connect-assets');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');

/**
 * Create MySQL Server with config data
 */

var db = mysql.createConnection(mysqlconfig.config);

/**
 * Create Express server
 */

var app = express();

/**
 * Export the app for testability
 */

module.exports = app;

/**
 * Express configuration
 */

app.set('port', process.env.PORT || 8080);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(connectAssets({
    paths: ['public/css', 'public/js', 'bower_components'],
    helperContext: app.locals
}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

var env = process.env.NODE_ENV || 'development';
if ('development' == env) {
    app.locals.pretty = true;
}

// This is used for url parsing in the middle of a jade template
app.locals.url = require('url');

/**
 * Multi Language Support
 */

// create the language module and store a reference in the global
// namespace using the identifier 'lang', so it can be accessed
// from everywhere within the application
global.lang = require('./controllers/lang')();

/**
 * Controllers
 */

var homeController = require('./controllers/home')();
var personsController = require('./controllers/persons')(db);
var singleController = require('./controllers/person')(db);
var companiesController = require('./controllers/companies')(db);
var singleCompanyController = require('./controllers/company')(db);
var importController = require('./controllers/import')(db);
var errorController = require('./controllers/error')();

/**
 * Routes
 */

app.get('/', homeController.index);

app.get('/persons', personsController.index);
app.get('/persons/new', personsController.newIndex);
app.post('/persons/new', personsController.addPerson);
app.post('/persons/find', personsController.findID);
app.post('/persons/delete', personsController.delete);
app.post('/searchPerson', personsController.searchPerson);
app.post('/sortColumns', personsController.sortColumns);
app.post('/editMemo', personsController.editMemo);

app.get('/persons/:id', singleController.index);
app.get('/persons/:id/edit', singleController.editIndex);
app.post('/persons/:id/edit', singleController.edit);
app.post('/persons/:id/editMemo', singleController.editMemo);

app.get('/companies', companiesController.index);
app.get('/companies/new', companiesController.newIndex);
app.post('/companies/new', companiesController.addCompany);
app.post('/companies/find', companiesController.findID);
app.get('/companies/:id', singleCompanyController.index);

app.get('/import', importController.index);
app.post('/import', importController.handleUpload);

app.get('/about', homeController.about);

app.get('/makecoffee', homeController.coffee);

/**
 * Error Handling
 */

// Registers all error handlers for the application
// NOTE: if you want the error handler debug routes, set the second parameter to true
//errorController.registerErrorHandlers(app, false);

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
