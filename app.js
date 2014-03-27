var express = require('express');
var mysql = require('mysql');
var mysqlconfig = require('./mysqlconfig');

var db = mysql.createConnection(mysqlconfig.config);

var app = express();

app.get('/', function(req,res){
	res.send('Hello World');
});

db.connect(function(err){
	if (err) {throw err}
	console.log("connected to database!");
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
