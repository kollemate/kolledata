module.exports = function() {

    module.index = function(req, res) {
        var dict = lang.getDictionaryFromRequestHeader(req);
        res.render('home', { title: 'Home', dict: dict });
    };

    module.about = function(req, res) {
        var dict = lang.getDictionaryFromRequestHeader(req);
        res.render('about', { title: 'About', dict: dict });
    };

    module.coffee = function(req, res) {
        res.statusCode = 418;
        res.set('Content-Type', 'text/plain');
        res.send("But I'm a teapot.");
    };

    return module;
};
