var express = require('express');
var mysql = require('mysql');
var mysqlconfig = require('./mysqlconfig');
var path = require('path');

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

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

/**
 * Load controllers.
 */

var homeController = require('./controllers/home');

/**
 * Routes
 */

 app.get('/', homeController.index);

db.connect(function(err){
	if (err) {
		console.error('✗ MySQL Connection Error. Please make sure MySQL server is running.');
	} else {
		console.log("connected to database!");
	}
});

db.query('USE kolledata');

db.query('SELECT * FROM `kd_person`', function(err, rows, fields) {
  if (err) throw err;

  for (var i = 0; i < rows.length; i++) {
  	console.log(rows[i].per_firstname + " " + rows[i].per_name);
  };
});

db.end();

app.listen(8080);
console.log("Listening on http://localhost:8080");
