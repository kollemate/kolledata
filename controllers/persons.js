// this is needed for mysql.format prepared statements, not db connections
var mysql = require('mysql');

module.exports = function(db) {
    // this format is adapted from here:
    // http://stackoverflow.com/a/23584255/1843020

    // get all persons and join their company IDs with the actual names
    module.index = function(req, res, next) {
        var sql = 'SELECT * FROM kd_person LEFT OUTER JOIN kd_company ON kd_person.per_company = kd_company.com_id;';

        db.query(sql, function(err, rows, fields) {
            if (err)
                return next('db error');
            var persons = rows;

            var sql = 'SELECT * FROM kd_company;';
            db.query(sql, function(err, rows, fields){
                if (err)
                    return next('db error');
                var companies = rows;

                res.render('persons/persons', {
                    title: 'Persons',
                    results: persons,
                    companies: companies
                });
            });
        });
    };

    module.newIndex = function(req, res, next) {
        var sql = 'SELECT com_name FROM kd_company';
        db.query(sql, function(err, rows){
            if (err)
                return next('db error');

            res.render('persons/newperson', {
                title: 'Add New Person',
                companies: rows
            });
        });
    };

    module.findID = function(req, res, next) {
        var firstName = req.body.firstName;
        var lastName = req.body.lastName;

        var sql = 'SELECT per_id FROM kd_person WHERE per_firstname = ? AND per_name = ?;';
        var inserts = [firstName, lastName];
        sql = mysql.format(sql, inserts);

        db.query(sql, function(err, rows){
            if (err)
                return next('db error');

            res.set('Content-Type', 'text/json');
            res.send(rows);
        });
    };

    module.addPerson = function(req, res, next) {
        var firstName = req.body.firstName;
        var lastName = req.body.lastName;
        var url = req.body.url;
        var email1 = req.body.email1;
        var email2 = req.body.email2;
        var memo = req.body.memo;
        var company = req.body.company;

        //TODO: Do this as a frontend validation, so no user data is lost
        if (firstName === '' && lastName === '') {
            res.redirect('/persons');
            return;
        }

        // get company id of chosen company from add new person dropdown
        var sql = 'SELECT com_id FROM kd_company WHERE com_name = ?;';
        var inserts = [company];
        sql = mysql.format(sql, inserts);
        db.query(sql, function(err,rows,fields){
            if (company === '- N/A -') {
                company = null;
            } else {
                company = rows[0].com_id;
            }

            // insert person with the now correct company into the database
            var sql = 'INSERT INTO kd_person (per_name, per_firstname, per_url, per_memo, per_email1, per_email2, per_timestamp, per_company) VALUES (?, ?, ?, ?, ?, ?, NOW(), ?)';
            var inserts = [lastName, firstName, url, memo, email1, email2, company];
            sql = mysql.format(sql, inserts);
            db.query(sql, function(err, rows){
                if (err)
                    return next('db error');

                // get all persons joined with their respective company names
                var sql = 'SELECT * FROM kd_person LEFT OUTER JOIN kd_company ON kd_person.per_company = kd_company.com_id;';
                db.query(sql, function(err, rows, fields) {
                    if (err)
                        return next('db error');
                    var persons = rows;

                    // get all companies to pass on to jade so that the dropdown
                    // in the add persons modal can be displayed
                    var sql = 'SELECT * FROM kd_company;';
                    db.query(sql, function(err, rows, fields){
                        if (err)
                            return next('db error');
                        var companies = rows;

                        res.redirect('/persons');
                    });
                });
            });
        });
    };

    module.delete = function(req, res, next) {
        var per_id = req.body.per_id;

        var sql = 'DELETE FROM kd_person WHERE per_id=?;';
        var inserts = [per_id];
        sql = mysql.format(sql, inserts);
        db.query(sql, function(err){
            if (err)
                return next('db error');

            // redirect to /persons after deleting the entry to rerender the view
            res.redirect('/persons');
        });
    };

    // dynamic search function
    module.searchPerson = function(req, res, next) {
        var search = req.body.searchInput;
        search = '%' + search + '%';

        var sql = 'SELECT * FROM kd_person LEFT OUTER JOIN kd_company ON kd_person.per_company = kd_company.com_id WHERE per_name LIKE ? OR per_firstname LIKE ? OR per_url LIKE ? OR com_name LIKE ?;';
        var inserts = [search, search, search, search];
        sql = mysql.format(sql, inserts);

        db.query(sql, function(err, rows, fields) {
            if (err)
                return next('db error');
            var persons = rows;

            var sql = 'SELECT * FROM kd_company;';
            db.query(sql, function(err, rows, fields){
                if (err)
                    return next('db error');
                var companies = rows;

                res.render('persons/persons', {
                    title: 'Persons',
                    results: persons,
                    companies: companies
                });
            });
        });
    };

    module.sortColumns = function(req, res, next) {
        var column = req.body.sortColumn;
        var order = req.body.sortOrder;

        var sql;

        switch(column) {
            case "per_firstname":
                sql = 'SELECT * FROM kd_person \
                LEFT OUTER JOIN kd_company ON kd_person.per_company = kd_company.com_id \
                ORDER BY per_firstname;';
                break;
            case "per_name":
                sql = 'SELECT * FROM kd_person \
                LEFT OUTER JOIN kd_company ON kd_person.per_company = kd_company.com_id \
                ORDER BY per_name;';
                break;
            case "per_email1":
                sql = 'SELECT * FROM kd_person \
                LEFT OUTER JOIN kd_company ON kd_person.per_company = kd_company.com_id \
                ORDER BY per_email1;';
                break;
            case "per_url":
                sql = 'SELECT * FROM kd_person \
                LEFT OUTER JOIN kd_company ON kd_person.per_company = kd_company.com_id \
                ORDER BY per_url;';
                break;
            case "per_phone1":
                sql = 'SELECT * FROM kd_person \
                LEFT OUTER JOIN kd_company ON kd_person.per_company = kd_company.com_id \
                ORDER BY per_phone1;';
                break;
            case "com_name":
                sql = 'SELECT * FROM kd_person \
                LEFT OUTER JOIN kd_company ON kd_person.per_company = kd_company.com_id \
                ORDER BY com_name;';
                break;
            case "unsort":
                sql = 'SELECT * FROM kd_person \
                LEFT OUTER JOIN kd_company ON kd_person.per_company = kd_company.com_id;';
                break;
            default:
                sql = 'SELECT * FROM kd_person \
                LEFT OUTER JOIN kd_company ON kd_person.per_company = kd_company.com_id;';
                break;
        }

        if (order != 'ASC' && order != 'DESC' && order != 'unsort') {
            order = 'ASC';
        }

        if (order != 'unsort') {
            sql = sql.substr(0, sql.length-1) + " " + order + ';';
        }

        if (order == 'ASC') {
            order = 'DESC';
        } else if (order == 'DESC') {
            order = 'ASC';
        } else if (order == 'unsort') {
            order = 'undefined';
        }

        db.query(sql, function(err, rows, fields) {
            if (err)
                return next('db error');
            var persons = rows;

            var sql = 'SELECT * FROM kd_company;';
            db.query(sql, function(err, rows, fields){
                if (err)
                    return next('db error');
                var companies = rows;

                res.render('persons/persons', {
                    title: 'Persons',
                    results: persons,
                    companies: companies,
                    column: column,
                    order: order
                });
            });
        });
    };

    // edit memo field
    module.editMemo = function(req, res, next) {
        var memo = req.body.memo;
        var id = req.body.id;

        var sql = 'UPDATE kd_person SET per_memo = ? WHERE per_id = ?;';
        var inserts = [memo, id];
        sql = mysql.format(sql, inserts);

        db.query(sql, function(err, rows, fields) {
            if (err)
                return next('db error');

            res.writeHead(200, { 'Content-Type': 'application/json'});
            res.end(JSON.stringify({ memo: memo, id : id }));
            res.end();
        });
    };

    return module;
};
