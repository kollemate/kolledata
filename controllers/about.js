module.exports = function() {

    module.index = function(req, res) {
        res.render('about', {
            title: 'About'
        });
    };

    return module;
};
