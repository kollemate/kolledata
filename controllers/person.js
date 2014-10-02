// this is needed for mysql.format prepared statements, not db connections
var mysql = require('mysql');
var md5 = require('MD5');

module.exports = function(db) {

    module.index = function(req, res, next) {
        var per_id = req.params.id;

        var sql = 'SELECT * FROM kd_person LEFT OUTER JOIN kd_company ON kd_person.per_company = kd_company.com_id LEFT OUTER JOIN kd_category ON kd_person.per_category = kd_category.cat_id WHERE per_id = ?';
        var inserts = [per_id];
        sql = mysql.format(sql, inserts);
        db.query(sql, function(err, rows, fields){
            if (err)
                return next('db error');

            var person = rows;
            var gravatar = '';

            if (person[0].per_email1 === null)
                gravatar = 'http://gravatar.com/avatar/' + md5(0) + '?s=50';
            else
                gravatar = 'http://gravatar.com/avatar/' + md5(person[0].per_email1) + '?s=100';

            res.render('persons/person', {
                title: person[0].per_firstname + ' ' + person[0].per_name,
                results: person,
                gravatar: gravatar
            });
        });
    };

    module.editIndex = function(req, res, next) {
        var per_id = req.params.id;

        var sql = 'SELECT * FROM kd_person LEFT OUTER JOIN kd_company ON kd_person.per_company = kd_company.com_id LEFT OUTER JOIN kd_category ON kd_person.per_category = kd_category.cat_id WHERE per_id = ?';
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

                var sql = 'SELECT cat_name FROM kd_category;';
                db.query(sql, function(err, rows, fields){
                    if (err)
                        return next('db error');

                    var categories = rows;

                    res.render('persons/editPerson', {
                        title: person[0].per_firstname + ' ' + person[0].per_name + ' bearbeiten',
                        results: person,
                        companies: companies,
                        categories : categories
                    });
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
        var address = req.body.address;
        var postcode = req.body.postcode;
        var city = req.body.city;
        var country = req.body.country;
        var phone1 = req.body.phone1;
        var phone2 = req.body.phone2;
        var fax = req.body.fax;
        var department = req.body.department;
        var category = req.body.category;

        var sql = 'SELECT com_id FROM kd_company WHERE com_name = ?;';
        var inserts = [company];
        sql = mysql.format(sql, inserts);
        db.query(sql, function(err, rows, fields) {
            if (company === '- N/A -') {
                company = null;
            } else {
                company = rows[0].com_id;
            }

            var sql = 'SELECT cat_id FROM kd_category WHERE cat_name = ?;';
            var inserts = [category];
            sql = mysql.format(sql, inserts);
            db.query(sql, function(err, rows, fields) {
                if (category === '- N/A -') {
                    category = null;
                } else {
                    category = rows[0].cat_id;
                }
                
                var sql = 'UPDATE kd_person SET per_name = ?, per_firstname = ?, per_url = ?, per_company = ?, per_email1 = ?, per_email2 = ?, per_address = ?, per_postcode = ?, per_city = ?, per_country = ?, per_phone1 = ?, per_phone2 = ?, per_fax = ?, per_department = ?, per_category = ?, per_timestamp = NOW() WHERE per_id = ?;';
                var inserts = [name, firstName, url, company, email1, email2, address, postcode, city, country, phone1, phone2, fax, department, category, per_id];
                sql = mysql.format(sql, inserts);
                db.query(sql, function(err, rows, fields){
                    res.redirect('/persons/' + per_id);
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

            res.redirect('/persons/' + id);
        });
    };

    return module;
};
