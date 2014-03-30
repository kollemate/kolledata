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
  paths: ['public/css', 'public/js'],
  helperContext: app.locals
}));

/**
 * Load controllers.
 */

var homeController = require('./controllers/home');

/**
 * Routes
 */

app.get('/', homeController.index);

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

// db.query('USE kolledata');

// db.query('SELECT * FROM `kd_person`', function(err, rows, fields) {
//   if (err) throw err;
//   console.log("\nJust some sample output from the database:")
//   for (var i = 0; i < rows.length; i++) {
//   	console.log(rows[i].per_firstname + " " + rows[i].per_name);
//   };
// });

// db.end();

app.listen(app.get('port'), function() {
  console.log("✔ Express server listening on http://localhost:%d", app.get('port'));
});
