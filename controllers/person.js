// this is needed for mysql.format prepared statements, not db connections
var mysql = require('mysql');
var md5 = require('MD5');

module.exports = function(db) {

    module.index = function(req, res, next) {
        var per_id = req.params.id;

        var sql = 'SELECT * FROM kd_person LEFT OUTER JOIN kd_company ON kd_person.per_company = kd_company.com_id WHERE per_id = ?';
        var inserts = [per_id];
        sql = mysql.format(sql, inserts);
        db.query(sql, function(err, rows, fields){
            if (err)
                return next('db error');

            var person = rows;

            var dict = lang.getDictionaryFromRequestHeader(req);
            
            if (person[0]['per_email1'] === null)
                var gravatar = 'http://gravatar.com/avatar/' + md5(0) + '?s=50';
            else
                var gravatar = 'http://gravatar.com/avatar/' + md5(person[0]['per_email1']) + '?s=50';

            res.render('persons/person', {
                title: person[0]['per_firstname'] + ' ' + person[0]['per_name'],
                results: person,
                gravatar: gravatar,
                dict: dict
            });
        });
    };

    module.editIndex = function(req, res, next) {
        var per_id = req.params.id;

        var sql = 'SELECT * FROM kd_person LEFT OUTER JOIN kd_company ON kd_person.per_company = kd_company.com_id WHERE per_id = ?';
        var inserts = [per_id];
        sql = mysql.format(sql, inserts);
        db.query(sql, function(err, rows, fields){
            if (err)
                return next('db error');

            var person = rows;

            var sql = 'SELECT com_name FROM kd_company;';
            db.query(sql, function(err, rows, fields){
                if (err)
                    return next('db error');

                var companies = rows;

                var dict = lang.getDictionaryFromRequestHeader(req);

                res.render('persons/editPerson', {
                    title: person[0]['per_firstname'] + ' ' + person[0]['per_name'] + ' bearbeiten',
                    results: person,
                    companies: companies,
                    dict: dict
                });
            });
        });
    };

    module.edit = function(req, res, next) {
        var per_id = req.params.id;
        var name = req.body.name;
        var firstName = req.body.firstName;
        var url = req.body.url;
        var company = req.body.company;
        var email1 = req.body.email1;
        var email2 = req.body.email2;

        var sql = 'SELECT com_id FROM kd_company WHERE com_name = ?;';
        var inserts = [company];
        sql = mysql.format(sql, inserts);
        db.query(sql, function(err, rows, fields) {
            if (company === '- N/A -') {
                company = null;
            } else {
                company = rows[0].com_id;
            }

            var sql = 'UPDATE kd_person SET per_name = ?, per_firstname = ?, per_url = ?, per_company = ?, per_email1 = ?, per_email2 = ?,per_timestamp = NOW() WHERE per_id = ?;';
            var inserts = [name, firstName, url, company, email1, email2, per_id];
            sql = mysql.format(sql, inserts);
            db.query(sql, function(err, rows, fields){

                res.redirect('/persons/' + per_id);
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

            res.redirect('/persons/' + id);
        });
    };

    return module;
};
