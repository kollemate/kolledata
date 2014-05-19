// this is needed for mysql.format prepared statements, not db connections
var mysql = require('mysql');

module.exports = function(db) {

    module.index = function(req, res) {
        var sql = 'SELECT * FROM kd_company;';
        db.query(sql, function(err, rows, fields) {
            if (err) throw err;

            res.render('companies', {
                title: 'Companies',
                results: rows
            });
        });
    };

    return module;
};
