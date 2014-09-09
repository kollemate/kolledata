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
            var dict = lang.getDictionaryFromRequestHeader(req);

            res.render('companies/company', {
                title: rows[0].com_name,
                results: rows,
                dict: dict
            });
        });
    };

    return module;
};