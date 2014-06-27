module.exports = function() {

    module.index = function(req, res) {
        res.render('home', {
            title: 'Home'
        });
    };

    module.about = function(req, res) {
        res.render('about', {
            title: 'About'
        });
    };

    module.coffee = function(req, res) {
        res.statusCode = 418;
        res.set('Content-Type', 'text/plain');
        res.send("But I'm a teapot.");
    };

    return module;
};
