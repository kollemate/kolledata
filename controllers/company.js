// this is needed for mysql.format prepared statements, not db connections
var mysql = require('mysql');

module.exports = function(db) {

    module.index = function(req, res, next) {
        var com_id = req.params.id;

        var sql = 'SELECT * FROM kd_company WHERE com_id = ?;';
        var inserts = [com_id];
        sql = mysql.format(sql, inserts);
        db.query(sql, function(err, rows, fields) {
            if (err)
                return next('db error');

            res.render('companies/company', {
                title: rows[0].com_name,
                results: rows
            });
        });
    };

    module.editIndex = function(req, res, next) {
        var com_id = req.params.id;

        var sql = 'SELECT * FROM kd_company WHERE com_id = ?;';
        var inserts = [com_id];
        mysql.format(sql, inserts);
        db.query(sql, function(err, rows) {
            if (err)
                return next('db error');

            var company = rows;

            res.render('/companies/editCompany', {
                title: "Edit " + company[0].com_name,
                results: company
            });
        });
    };

    return module;
};
