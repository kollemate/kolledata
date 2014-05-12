var express = require('express');
var mysql = require('mysql');
var mysqlconfig = require('./mysqlconfig');
var path = require('path');
var connectAssets = require('connect-assets');
var package = require('./package.json');

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
app.use(express.bodyParser());

/**
 * Routes
 */

app.get('/', function(req, res) {
    res.render('home', {
        title: 'Home'
    });
});

app.get('/persons', function(req, res){
    var query = 'SELECT * FROM kd_person LEFT OUTER JOIN kd_company ON kd_person.per_company = kd_company.com_id;';

    db.query(query, function(err, rows, fields) {
        if (err) throw err;
        res.render('persons', {
            title: 'Persons',
            results: rows
        });
    });
});

app.post('/persons', function(req, res) {
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var url = req.body.url;
    var email = req.body.email;
    var memo = req.body.memo;
    var company = req.body.company;

    console.log(req.body);

    var query = 'INSERT INTO kolledata.kd_person (per_name, per_firstname, per_url, per_memo, per_timestamp, per_company) VALUES ("' +
    lastName + '","' + firstName + '","' + url + '","' + memo + '",NOW(),' + company + ");";

    db.query(query, function(err){
        if (err) throw err;
        var query = 'SELECT * FROM kd_person LEFT OUTER JOIN kd_company ON kd_person.per_company = kd_company.com_id;';
        db.query(query, function(err, rows, fields) {
            if (err) throw err;
            res.render('persons', {
                title: 'Persons',
                results: rows
            });
        });
    });
});

app.get('/companies', function(req, res){
    var query = 'SELECT * FROM kd_company;';

    db.query(query, function(err, rows, fields) {
        if (err) throw err;
        res.render('companies', {
            title: 'Companies',
            results: rows
        });
    });
});

app.get('/json', function(req, res) {
    res.set('Content-Type', 'text/json');
    res.send(package);
});

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

// we'd have to call db.end() somewhere, damn you async node!

app.listen(app.get('port'), function() {
    console.log("✔ Express server listening on http://localhost:%d", app.get('port'));
});
