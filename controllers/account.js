module.exports = function() {

    module.isAuthenticated = function(req, res, next) {
        req.session.lastUrl = req.url;
        if (req.session.username === undefined
            || req.session.password === undefined
            || !checkAccountData(req.session.username, req.session.password)
            ) {
            renderPage(req, res, 'info');
            return;
        }
        // if the user is logged in, get the requested page
        return next();
    };
    
    module.loginGet = function(req, res, next) {
        req.session.lastUrl = req.url;
        renderPage(req, res, 'login');
    };
    
    module.loginPost = function(req, res, next) {
        var username = req.body.username;
        var password = req.body.password;
        
        if (!checkAccountData(username, password)) {
            renderPage(req, res, 'failed');
            return;
        }
        
        // save the account date in the session cookie
        // NOTE: eventually the data will of course not be saved in plain text,
        // but hashes will be used instead
        req.session.username = username;
        req.session.password = password;
        // Maybe we can also just use a flag, but that might be unsafe, if someone
        // will just manipulate the cookie
        req.session.loggedIn = true;
        
        if (req.session.lastUrl === undefined || req.session.lastUrl === '/login') {
            renderPage(req, res, 'success');
            return;
        }
        res.redirect(req.session.lastUrl);
    };
    
    function checkAccountData(username, password) {
        // this will eventually be replaced by a database query
        if (username !== 'admin')
            return false;
        if (password !== 'password')
            return false;
        return true;
    };
    
    function renderPage(req, res, state) {
        var dict = lang.getDictionaryFromRequestHeader(req);
        res.render('login', { title: 'Login', dict: dict, state: state});
    };
    
    return module;
};
