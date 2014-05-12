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
    var sql = 'SELECT * FROM kd_person LEFT OUTER JOIN kd_company ON kd_person.per_company = kd_company.com_id;';

    db.query(sql, function(err, rows, fields) {
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


    var sql = 'INSERT INTO kd_person (per_name, per_firstname, per_url, per_memo, per_timestamp, per_company) VALUES (?, ?, ?, ?, NOW(), ?)';
    var inserts = [lastName, firstName, url, memo, company];
    sql = mysql.format(sql, inserts);

    db.query(sql, function(err){
        if (err) throw err;

        var sql = 'SELECT * FROM kd_person LEFT OUTER JOIN kd_company ON kd_person.per_company = kd_company.com_id;';
        db.query(sql, function(err, rows, fields) {
            if (err) throw err;

            // TODO: set timestamp over javascript, not from the database and use it here to select the exact entry
            var sql = 'SELECT per_id FROM kd_person WHERE per_name=? AND per_firstname=? AND per_url=?;';
            var inserts = [lastName, firstName, url];
            sql = mysql.format(sql, inserts);

            db.query(sql, function(err, rows, fields){
                if (err) throw err;

                var userID = rows[0]['per_id'];
                var sql = 'INSERT INTO kolledata.kd_email (em_person_id, em_email, em_timestamp) VALUES (?, ?, NOW());';
                var inserts = [userID, email];
                sql = mysql.format(sql, inserts);

                db.query(sql, function(err){
                    if (err) throw err;
                });
            });

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
