var express = require('express');
var mysql = require('mysql');
var mysqlconfig = require('./mysqlconfig');

var db = mysql.createConnection(mysqlconfig.config);

var app = express();

app.get('/', function(req,res){
	res.send('Hello World');
});

db.connect(function(err){
	if (!err) {
		console.log("connected to database!");
	} else {
		console.log("connection to database failed!");
	}
});

app.listen(8080);
console.log("Listening on http://localhost:8080");
