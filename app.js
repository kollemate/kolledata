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
app.use(express.urlencoded());
app.use(express.json());

// This is used for url parsing in the middle of a jade template
app.locals.url = require('url');

/**
 * Controllers
 */

var homeController = require('./controllers/home')();
var personsController = require('./controllers/persons')(db);
var singleController = require('./controllers/person')(db);
var companiesController = require('./controllers/companies')(db);
var importController = require('./controllers/import')();
var aboutController = require('./controllers/about')();
var apiController = require('./controllers/api')(db);
var errorController = require('./controllers/error')();

/**
 * Routes
 */

app.get('/', homeController.index);

app.get('/persons', personsController.index);
app.post('/persons', personsController.addPerson);
app.post('/persons/delete', personsController.delete);
app.post('/searchPerson', personsController.searchPerson);
app.post('/sortColumns', personsController.sortColumns);
app.post('/editMemo', personsController.editMemo);

app.get('/persons/:id', singleController.index);
app.get('/persons/:id/edit', singleController.editIndex);
app.post('/persons/:id/edit', singleController.edit);
app.post('/persons/:id/editMemo', singleController.editMemo);

app.get('/companies', companiesController.index);
app.post('/companies', companiesController.addCompany);

app.get('/import', importController.index);

app.get('/about', aboutController.index);

app.get('/api/package', apiController.package);
app.get('/api/persons', apiController.allPersons);
app.get('/api/companies', apiController.allCompanies);

app.get('/makecoffee', homeController.coffee);

// Generic Fallnback for 404 errors
app.get('*', errorController.fallback);

/**
 * Error Handling
 */
 
app.use(errorController.generic);

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
