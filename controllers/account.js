module.exports = function() {

    const _maxCookieAge = 2592000000; // 1 Month

    module.isAuthenticated = function(req, res, next) {
        // save the requested url, so the user can be redirected to it later
        req.session.lastUrl = req.url;
        // check if the session environment contains valid user data
        // and show the requested page if that the case
        if (req.session.username !== undefined
            && req.session.password !== undefined
            && !checkAccountData(req.session.user, req.session.password)
            ) {
            return next();
        }
        // otherwise check if there's a cookie which contains the required
        // user data, try to login the user and show the requested page if
        // the login was successful
        //var accCookie = req.cookies.get('kolledataAccountInfo');
        //if (accCookie != undefined && loginAccount(accCookie.username, accCookie.password, req))
        //    return next();
        // if there was no session data and no cookie, show the login screen to the user with the
        // info message, that he needs to be logged in to access the requested page
        renderPage(req, res, 'info');
    };
    
    module.loginGet = function(req, res, next) {
        res.cookies.set('username', 'blubxxx', { maxAge: _maxCookieAge });
    
        req.session.lastUrl = req.url;
        renderPage(req, res, 'login');
    };
    
    module.loginPost = function(req, res, next) {
        var username = req.body.username;
        var password = req.body.password;
        // try to login the user with the data from the login form and show an error page if the
        // login failed
        if (!loginAccount(username, password, req)) {
            renderPage(req, res, 'failed');
            return;
        }
        // if the user accessed the login page directly, simply show him a message, that the login
        // was successful
        if (req.session.lastUrl === undefined || req.session.lastUrl === '/login') {
            renderPage(req, res, 'success');
            return;
        }
        // if the user was redirected to the login page while accessing another page, the user is
        // redirected to the previously requested page
        res.redirect(req.session.lastUrl);
    };
    
    function loginAccount(username, password, req) {
        if (!checkAccountData(cookie.username, cookie.password))
            return false;
        // save the account date in the session data
        // NOTE: eventually the data will of course not be saved in plain text,
        // but hashes will be used instead
        req.session.username = username;
        req.session.password = password;
        // Maybe we can also just use a flag, but that might be unsafe
        req.session.loggedIn = true;
        return true;
    }
    
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
