var mysql = require('mysql');
var package = require('../package.json');

module.exports = function(db) {

    module.package = function(req, res, next) {
        res.set('Content-Type', 'text/json');
        res.send(package);
    };

    module.allPersons = function(req, res, next) {
        var sql = 'SELECT * FROM kd_person LEFT OUTER JOIN kd_company ON kd_person.per_company = kd_company.com_id;';
        db.query(sql, function(err, rows, fields){
            if (err)
                return next('db error');
            res.set('Content-Type', 'text/json');
            res.send(rows);
        });
    };

    module.allCompanies = function(req, res, next) {
        var sql = 'SELECT * FROM kd_company;';
        db.query(sql, function(err, rows, fields){
            if (err)
                return next('db error');
            res.set('Content-Type', 'text/json');
            res.send(rows);
        });
    };

    module.test = function(req, res, next) {
        res.set('Content-Type', 'text/json');
        res.send(req.body);
        console.log(req.body);
    };

    return module;
};
