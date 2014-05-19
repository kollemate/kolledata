var mysql = require('mysql');
var package = require('../package.json');

module.exports = function(db) {

    module.package = function(req, res) {
        res.set('Content-Type', 'text/json');
        res.send(package);
    };

    return module;
};
