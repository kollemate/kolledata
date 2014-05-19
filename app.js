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
    paths: ['public/css', 'public/js', 'bower_components'],
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
        var persons = rows;

        var sql = 'SELECT * FROM kd_company;';
        db.query(sql, function(err, rows, fields){
            if (err) throw err;
            var companies = rows;

            res.render('persons', {
                title: 'Persons',
                results: persons,
                companies: companies
            });
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

    // get company id of chosen company from add new person dropdown
    var sql = 'SELECT com_id FROM kd_company WHERE com_name = ?;';
    var inserts = [company];
    sql = mysql.format(sql, inserts);
    db.query(sql, function(err,rows,fields){
        if (company === '- N/A -') {
            company = null;
        } else {
            company = rows[0]['com_id'];
        }

        // insert person with the now correct company into the database
        var sql = 'INSERT INTO kd_person (per_name, per_firstname, per_url, per_memo, per_timestamp, per_company) VALUES (?, ?, ?, ?, NOW(), ?)';
        var inserts = [lastName, firstName, url, memo, company];
        sql = mysql.format(sql, inserts);
        db.query(sql, function(err, rows){
            if (err) throw err;

            // add email to the just changed row (rows.insertId is the id of the just added row)
            var sql = 'INSERT INTO kolledata.kd_email (em_person_id, em_email, em_timestamp) VALUES (?, ?, NOW());';
            var inserts = [rows.insertId, email];
            sql = mysql.format(sql, inserts);
            db.query(sql, function(err){
                if (err) throw err;

                // get all persons joined with their respective company names
                var sql = 'SELECT * FROM kd_person LEFT OUTER JOIN kd_company ON kd_person.per_company = kd_company.com_id;';
                db.query(sql, function(err, rows, fields) {
                    if (err) throw err;
                    var persons = rows;

                    var sql = 'SELECT * FROM kd_company;';
                    db.query(sql, function(err, rows, fields){
                        if (err) throw err;
                        var companies = rows;

                        res.render('persons', {
                            title: 'Persons',
                            results: persons,
                            companies: companies
                        });
                    });
                });
            });
        });
    });
});

app.post('/rmperson', function(req, res){
    var id = req.body.id;

    var sql = 'DELETE FROM kolledata.kd_person WHERE per_id=?;';
    var inserts = [id];
    sql = mysql.format(sql, inserts);
    db.query(sql, function(err){
        if (err) throw err;

        res.redirect('/persons');
    });
});

// dynamic search function
app.post('/searchPerson', function(req, res){
    var search = req.body.searchInput;
    search = '%' + search + '%';

    var sql = 'SELECT * FROM kd_person LEFT OUTER JOIN kd_company ON kd_person.per_company = kd_company.com_id WHERE per_name LIKE ? OR per_firstname LIKE ? OR per_url LIKE ? OR com_name LIKE ?;';
    var inserts = [search, search, search, search];
    sql = mysql.format(sql, inserts);

    db.query(sql, function(err, rows, fields) {
        if (err) throw err;
        var persons = rows;

        var sql = 'SELECT * FROM kd_company;';
        db.query(sql, function(err, rows, fields){
            if (err) throw err;
            var companies = rows;

            res.render('persons', {
                title: 'Persons',
                results: persons,
                companies: companies
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
