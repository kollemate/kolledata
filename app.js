var express = require('express');

var app = express();

app.get('/', function(req,res){
	res.send('Hello World');
});

app.listen(8080);
console.log("Listening on http://localhost:8080");
