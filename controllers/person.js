// this is needed for mysql.format prepared statements, not db connections
var mysql = require('mysql');

module.exports = function(db) {

    module.index = function(req, res) {
        var per_id = req.params.id;

        var sql = 'SELECT * FROM kd_person LEFT OUTER JOIN kd_company ON kd_person.per_company = kd_company.com_id WHERE per_id = ?';
        var inserts = [per_id];
        sql = mysql.format(sql, inserts);
        db.query(sql, function(err, rows, fields){
            if (err) throw err;

            var person = rows;

            var sql = 'SELECT em_email FROM kolledata.kd_email WHERE em_person_id = ?';
            var inserts = [per_id];
            sql = mysql.format(sql, inserts);
            db.query(sql, function(err, rows, fields){
                if (err) throw err;

                var emails = rows;

                res.render('person', {
                    title: person[0]['per_firstname'] + ' ' + person[0]['per_name'],
                    results: person,
                    emails: emails
                });
            });
        });
    };

    module.editIndex = function(req, res) {
        var per_id = req.params.id;

        var sql = 'SELECT * FROM kd_person LEFT OUTER JOIN kd_company ON kd_person.per_company = kd_company.com_id WHERE per_id = ?';
        var inserts = [per_id];
        sql = mysql.format(sql, inserts);
        db.query(sql, function(err, rows, fields){
            if (err) throw err;

            var person = rows;

            var sql = 'SELECT em_email FROM kolledata.kd_email WHERE em_person_id = ?';
            var inserts = [per_id];
            sql = mysql.format(sql, inserts);
            db.query(sql, function(err, rows, fields){
                if (err) throw err;

                var emails = rows;

                var sql = 'SELECT com_name FROM kd_company;';
                db.query(sql, function(err, rows, fields){
                    if (err) throw err;

                    var companies = rows;

                    res.render('editPerson', {
                        title: person[0]['per_firstname'] + ' ' + person[0]['per_name'] + ' bearbeiten',
                        results: person,
                        emails: emails,
                        companies: companies
                    });
                });
            });
        });
    };

    module.edit = function(req, res) {
        var per_id = req.params.id;
        var name = req.body.name;
        var firstName = req.body.firstName;
        var url = req.body.url;
        var company = req.body.company;

        // seriously.. fuck emails.

        var sql = 'SELECT com_id FROM kd_company WHERE com_name = ?;';
        var inserts = [company];
        sql = mysql.format(sql, inserts);
        db.query(sql, function(err, rows, fields) {
            if (company === '- N/A -') {
                company = null;
            } else {
                company = rows[0].com_id;
            }

            var sql = 'UPDATE kd_person SET per_name = ?, per_firstname = ?, per_url = ?, per_company = ?, per_timestamp = NOW() WHERE per_id = ?;';
            var inserts = [name, firstName, url, company, per_id];
            sql = mysql.format(sql, inserts);
            db.query(sql, function(err){
                if (err) throw err;

                res.redirect('/persons/' + per_id);
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

            res.redirect('/persons/' + id);
        });
    };

    return module;
};
