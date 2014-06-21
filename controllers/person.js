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

    return module;
};
