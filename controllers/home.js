module.exports = function() {

    module.index = function(req, res) {
        res.render('home', {
            title: 'Home'
        });
    };

    return module;
};
