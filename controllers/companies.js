// this is needed for mysql.format prepared statements, not db connections
var mysql = require('mysql');

module.exports = function(db) {

    module.index = function(req, res) {
        var sql = 'SELECT * FROM kd_company;';
        db.query(sql, function(err, rows, fields) {
            if (err) throw err;
            var dict = lang.getDictionaryFromRequestHeader(req);

            res.render('companies/companies', {
                title: 'Companies',
                results: rows,
                dict: dict
            });
        });
    };

    module.addCompany = function(req, res) {
        var name = req.body.name;
        var url = req.body.url;
        var email = req.body.email;
        var memo = req.body.memo;

        var sql = 'INSERT INTO kd_company (com_name, com_url, com_email com_memo, per_timestamp) VALUES (?, ?, ?, NOW())';
        var inserts = [name, url, memo];
        sql = mysql.format(sql, inserts);
        db.query(sql, function(err, rows){
            if (err) throw err;

            var sql = 'INSERT INTO kolledata.kd_email (em_person_id, em_email, em_timestamp) VALUES (?, ?, NOW());';
            var inserts = [rows.insertId, email];
        });
    };

    return module;
};
