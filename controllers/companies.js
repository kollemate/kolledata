// this is needed for mysql.format prepared statements, not db connections
var mysql = require('mysql');

module.exports = function(db) {

    module.index = function(req, res, next) {
        var sql = 'SELECT * FROM kd_company;';
        db.query(sql, function(err, rows, fields) {
            if (err)
                return next('db error');
            var dict = lang.getDictionaryFromRequestHeader(req);

            res.render('companies/companies', {
                title: 'Companies',
                results: rows,
                dict: dict
            });
        });
    };

    module.newIndex = function(req, res, next) {
        var dict = lang.getDictionaryFromRequestHeader(req);
        res.render('companies/newcompany', {
           title: 'Companies',
           dict: dict
        });
    };

    module.findID = function(req, res, next) {
        var companyName = req.body.companyName;

        var sql = 'SELECT com_id FROM kd_company WHERE com_name = ?;';
        var inserts = [companyName];
        sql = mysql.format(sql, inserts);
        console.log(sql);
        db.query(sql, function(err, rows) {
            if (err)
                return next('db error');

            res.set('Content-Type', 'text/json');
            res.send(rows);
        });
    };

    module.addCompany = function(req, res, next) {
        var name = req.body.name;
        var email1 = req.body.email1;
        var email2 = req.body.email2;
        var phone1 = req.body.phone1;
        var phone2 = req.body.phone2;
        var fax = req.body.fax;
        var country = req.body.country;
        var city = req.body.city;
        var postcode = req.body.postcode;
        var address = req.body.address;
        var url = req.body.url;
        var memo = req.body.memo;

        var sql = 'INSERT INTO kd_company (com_name, com_email1, com_email2, com_phone1, com_phone2, com_fax, com_country, com_city, com_postcode, com_address, com_url, com_memo, com_timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())';
        var inserts = [name, email1, email2, phone1, phone2, fax, country, city, postcode, address, url, memo];
        sql = mysql.format(sql, inserts);
        console.log(sql);
        db.query(sql, function(err, rows){
            if (err)
                return next('db error');

            res.redirect('/companies');
        });
    };

    module.delete = function(req, res, next) {
        var com_id = req.body.com_id;

        var sql = 'DELETE FROM kd_company WHERE com_id=?;';
        var inserts = [com_id];
        mysql.format(sql, inserts);
        db.query(sql, function (err){
            if (err)
                return next('db error');

            res.redirect('companies');
        });
    };

    module.searchCompany = function(req, res, next) {
        var search = req.body.searchInput;
        search = '%' + search + '%';

        var sql = 'SELECT * FROM kd_company WHERE com_name LIKE ? OR com_email1 LIKE ? OR com_email2 LIKE ? OR com_url LIKE ?;';
        var inserts = [search, search, search, search];
        mysql.format(sql, inserts);
        db.query(sql, function(err, rows){
            if (err)
                return next('db error');

            var companies = rows;
            var dict = lang.getDictionaryFromRequestHeader(req);

            res.render('companies/companies', {
                title: 'Companies',
                results: companies,
                dict: dict
            });
        });
    };

    module.sortColumns = function(req, res, next) {
        var column = req.body.sortColumn;
        var order = req.body.sortOrder;

        var sql;

        switch (column) {
            case "com_name":
                sql = "SELECT * FROM kd_company ORDER BY com_name";
                break;
            case "com_email1":
                sql = "SELECT * FROM kd_company ORDER BY com_email1";
                break;
            case "com_phone1":
                sql = "SELECT * FROM kd_company ORDER BY com_phone1";
                break;
            case "com_url":
                sql = "SELECT * FROM kd_company ORDER BY com_url";
                break;
        }

        if (order != 'ASC' && order != 'DESC' && order != 'unsort') {
            order = 'ASC';
        }

        if (order != 'unsort') {
            sql = sql.substr(0, sql.length-1) + " " + order + ';';
        }

        if (order == 'ASC') {
            order = 'DESC';
        } else if (order == 'DESC') {
            order = 'ASC';
        } else if (order == 'unsort') {
            order = 'undefined';
        }

        db.query(sql, function(err, rows) {
            if (err)
                return next('db error');

            var dict = lang.getDictionaryFromRequestHeader(req);

            res.render('companies/companies', {
                title: 'Companies',
                results: rows,
                column: column,
                order: order,
                dict: dict
            });
        });
    };

    module.editMemo = function(req, res, next) {
        var memo = req.body.memo;
        var id = req.body.id;

        var sql = 'UPDATE kd_company SET com_memo = ? WHERE com_id = ?;';
        var inserts = [memo, id];
        mysql.format(sql, inserts);
        db.query(sql, function(err, rows){
            if (err)
                return next('db error');

            res.writeHead(200, { 'Content-Type': 'application/json'});
            res.end(JSON.stringify({ memo: memo, id : id }));
            res.end();
        });
    };

    return module;
};
