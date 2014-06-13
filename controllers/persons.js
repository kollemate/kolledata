// this is needed for mysql.format prepared statements, not db connections
var mysql = require('mysql');
var async = require('async');



module.exports = function(db) {
    // this format is adapted from here:
    // http://stackoverflow.com/a/23584255/1843020

    // get all persons and join their company IDs with the actual names
    module.index = function(req, res) {
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
    };



    function addPerson(req, res) {
        var person = req.body;
        async.waterfall([
            async.apply(getCompanyIdByName, person.company),
            async.apply(insertPerson, person),
            async.apply(insertEmail, person)],
        function (err) {
            // TODO inserting a person failed
        });
        async.parallel({
            persons     : getPersonsWithCompanies,
            companies   : getCompanies
        }, function (err, data) {
            // TODO getting persons or companies failed
            res.render('persons', {
                title       : 'Persons',
                results     : data.persons,
                companies   : data.companies
            });
        });
    };

    module.addPerson = addPerson;

    function getCompanyIdByName(com_name, cb) {
        // get company id of chosen company from add new person dropdown
        var sql     = 'SELECT com_id FROM kd_company \
                       WHERE com_name = ?;';
        var inserts = [com_name];
        var query   = mysql.format(sql, inserts);
        db.query(sql, function(err, rows) {
            if (err) return cb(err);
            if (com_name === '- N/A -') {
                cb(null, null);
            } else {
                cb(null, rows[0].com_id);
            }
        });
    }

    function insertPerson(person, com_id, cb) {
        // insert person with the now correct company into the database
        var sql     = 'INSERT INTO kd_person        \
            (per_name, per_firstname, per_url,      \
             per_memo, per_timestamp, per_company)  \
            VALUES (?, ?, ?, ?, NOW(), ?)';
        var p       = person;
        var inserts = [p.lastName, p.firstName, p.url, p.memo, com_id];
        var query   = mysql.format(sql, inserts);
        db.query(sql, function(err, rows) {
            cb(err, rows.insertId);
        });
    }

    function insertEmail(person, insertId, cb) {
        // add email to the just changed row (rows.insertId is the id of the just added row)
        var sql     = 'INSERT INTO kolledata.kd_email   \
            (em_person_id, em_email, em_timestamp)      \
            VALUES (?, ?, NOW());';
        var inserts = [insertId, person.email];
        var query   = mysql.format(sql, inserts);
        db.query(sql, cb);
    }

    function getPersonsWithCompanies(cb) {
        // get all persons joined with their respective company names
        var sql     = 'SELECT * FROM kd_person  \
            LEFT OUTER JOIN kd_company          \
            ON kd_person.per_company = kd_company.com_id;';
        db.query(sql, function(err, rows) {
            var persons = rows;
            cb(err, persons);
        });
    }

    function getCompanies(cb) {
        db.query('SELECT * FROM kd_company;', cb);
    }



    module.removePerson = function(req, res) {
        var id = req.body.id;

        var sql = 'DELETE FROM kolledata.kd_person WHERE per_id=?;';
        var inserts = [id];
        sql = mysql.format(sql, inserts);
        db.query(sql, function(err){
            if (err) throw err;

            // redirect to /persons after deleting the entry to rerender the view
            // also check issue #30 for a better idea of handling this entire request
            res.redirect('/persons');
        });
    };

    // dynamic search function
    module.searchPerson = function(req, res) {
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
    };

    // edit memo field
    module.editMemo = function(req, res) {
        var memo = req.body.memo;
        var id = req.body.id;

        var sql = 'UPDATE kd_person SET per_memo = ? WHERE per_id = ?;';
        var inserts = [memo, id];
        sql = mysql.format(sql, inserts);

        db.query(sql, function(err, rows, fields) {
            if (err) throw err;

            res.writeHead(200, { 'Content-Type': 'application/json'});
            res.end(JSON.stringify({ memo: memo, id : id }));
            res.end();
        });
    };

    return module;
};
