// this is needed for mysql.format prepared statements, not db connections
var mysql = require('mysql');

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

    module.addPerson = function(req, res) {
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
                company = rows[0].com_id;
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

                        // get all companies to pass on to jade so that the dropdown
                        // in the add persons modal can be displayed
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
    };

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

    return module;
};