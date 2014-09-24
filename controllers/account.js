module.exports = function() {

    module.isAuthenticated = function(req, res, next) {
        // if the user is logged in, get the requested page
        //if (req.user.authenticated)
            return next();
        // otherwise redirect him to the login page
        //res.redirect('/login');
    };
    
    module.login = function(req, res) {
        var dict = lang.getDictionaryFromRequestHeader(req);
        res.render('login', { title: 'Login', dict: dict });
    };
    
    return module;
};