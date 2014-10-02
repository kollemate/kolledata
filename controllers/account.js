/**
 * Responsible for handling all account related issues like logging in users,
 * creating account cookies etc.
 *
 * @class account
 * @constructor
 */
module.exports = function() {
    /**
     * Constant integer that determines the maximum age in milliseconds of the account info cookie.
     * A value if 2592000000 for example would correspond to a lifetime of one month.
     *
     * @property _maxCookieAge
     * @type int
     * @final
     */
    const _maxCookieAge = 2592000000;
    /**
     * Constant string that determines the name of the account info cookie.
     *
     * @property _cookieName
     * @type string
     * @final
     */
    const _cookieName = 'kolledataAccountInfo';
    /**
     * Constant string that determines the algorithm which is used to hash plain-text passwords.
     *
     * @property _hashAlgorithm
     * @type string
     * @final
     */
    const _hashAlgorithm = 'sha512';
    /**
     * Constant string that determines the string encoding which is used for hashes.
     *
     * @property _hashEncoding
     * @type string
     * @final
     */
    const _hashEncoding = 'utf-8';
    /**
     * Debug method for creating the admin account, this method will only work if there is
     * currently no existing admin account, otherwise the database query will simply fail.
     *
     * @method createAdmin
     * @param {object} [req] Node req object.
     * @param {object} [res] Node response object.
     * @param (object) [next] Node next object.
     */
    module.createAdmin = function(req, res, next) {
        var crypto = require('crypto');
        
        crypto.randomBytes(64, function(ex, buf) {
        
            var saltBuff = buf.toString(_hashEncoding);
            var saltHash = crypto.createHash('sha256');
            saltHash.update(saltBuff, 'binary');
            var salt = saltHash.digest('hex').toString(_hashEncoding);
            console.log('salt: ' + salt);
            
            var hash = crypto.createHash(_hashAlgorithm);
            hash.update('password' + salt, _hashEncoding);
            var buffer = hash.digest('hex');
            var passwordHash = buffer.toString(_hashEncoding);
            console.log('pass: ' + passwordHash);
            
            var sql = 'INSERT INTO kd_account (acc_username, acc_password, acc_salt) VALUES (\''
                + 'admin' + '\', \'' + passwordHash + '\', \'' + salt + '\');';
            db.query(sql, function(err, rows, fields) {
                if (err)
                    return next('db error');
                renderLoginPage(req, res, 'login');
            });
        });
    }
    /**
     * Checks if the user is authenticated to access the requested page. First checks if there
     * are valid session parameters, if not it checks if there is a account info cookie which
     * contains valid login data. If that also isn't the case the user is shown the login page
     * instead of the requested page with the info that he must first login to see the page.
     *
     * @method isAuthenticated
     * @param {object} [req] Node req object.
     * @param {object} [res] Node response object.
     * @param (object) [next] Node next object.
     */
    module.isAuthenticated = function(req, res, next) {
        // save the requested url, so the user can be redirected to it later
        req.session.authUrl = req.url;
        // NOTE: Could this be a possible security issue? The content of  the session variable is
        // only accessible at the server side, with the client side only storing the session id.
        // The alternative is comparing the account info with the database every time a page is
        // accessed, which might be a little to much.
        if (req.session.loggedIn === true)
            return next();
        
        // 
        var accCookie = getCookie(req);
        if (accCookie === undefined) {
            renderLoginPage(req, res, 'info');
            return;
        }
        getAccountData(accCookie.username, function(err, accData) {
            if (err)
                return next('db error');
            if (accData === undefined || accCookie.password != accData.password) {
                renderLoginPage(req, res, 'failed');
                return;
            }
            req.session.username = accData.username;
            req.session.password = accData.password;
            req.session.autologin = true;
            req.session.loggedIn = true;
            // reset the cookie and thus its expire date
            setCookie(res, accData.username, accData.password);
            // also set the loggedIn var in the local context, so the view can display the correct
            // page content
            res.locals.loggedIn = true;
            res.locals.username = accData.username;
            return next();
        });
    };
    /**
     * Displays the long page if the user is not already logged in. If the user is logged in he
     * is redirected to the root page.
     *
     * @method loginGet
     * @param {object} [req] Node req object.
     * @param {object} [res] Node response object.
     * @param (object) [next] Node next object.
     */
    module.loginGet = function(req, res, next) {
        if (req.session.loggedIn !== undefined && req.session.loggedIn === true) {
            res.redirect('/');
            return
        }
        req.session.authUrl = req.url;
        renderLoginPage(req, res, 'login');
    };
    /**
     * Handles the users post request if he tried to login via the login page.
     * Checks if the users username and password were correct and shows an corresponding message 
     * if thats not the case. Otherwise the user is now logged in, the session parameters are set
     * accordingly and the account info cookie is saved, if the user checked the corresponding
     * checkbox. if the user was redirected to the login page while he wanted to access another
     * page he is now redirected to that page. Otherwise a simply success message is displayed.
     *
     * @method loginPost
     * @param {object} [req] Node req object.
     * @param {object} [res] Node response object.
     * @param (object) [next] Node next object.
     */
    module.loginPost = function(req, res, next) {
        var username = req.body.username;
        var password = req.body.password;
        var autoLogin = false;
        if (req.body.autoLogin !== undefined && req.body.autoLogin === 'auto-login')
            autoLogin = true;
        
        getAccountData(username, function(err, accData) {
            if (err)
                return next('db error');
            // if the username was wrong, no account data could be retrieved so show the error msg
            if (accData === undefined) {
                renderLoginPage(req, res, 'failed');
                return;
            }
            var passHash = getPasswordHash(password, accData.salt);
            // if the password hashes don't match, show the error page
            if (passHash != accData.password) {
                renderLoginPage(req, res, 'failed');
                return;
            }
            req.session.username = accData.username;
            req.session.password = accData.password;
            req.session.autologin = autoLogin;
            req.session.loggedIn = true;
            // if the user wants to stay logged in, set the corresponding cookie
            if (autoLogin)
                setCookie(res, accData.username, accData.password);
            // also set the loggedIn var in the local context, so the view can display the correct
            // page content
            res.locals.loggedIn = true;
            res.locals.username = accData.username;
            // if the user accessed the login page directly, simply show him a message, that the 
            // login was successful
            if (req.session.authUrl === undefined || req.session.authUrl === '/login') {
                renderLoginPage(req, res, 'success');
                return;
            }
            // if the user was redirected to the login page while accessing another page, the user
            // is redirected to the previously requested page
            res.redirect(req.session.authUrl);
        });
    };
    /**
     * Logs the user out and redirects him to the login page if he currently is logged in. If not
     * the user is redirected to the root page.
     *
     * @method logoutGet
     * @param {object} [req] Node req object.
     * @param {object} [res] Node response object.
     * @param (object) [next] Node next object.
     */
    module.logoutGet = function(req, res, next) {
        // if the user is not logged in, he can't logout, so simply redirect him to the front page
        if (req.session.loggedIn !== true) {
            res.redirect('/');
            return;
        }
        // if the user wants to login automatically, set the corresponding cookie
        if (req.session.autoLogin == true)
            setCookie(res, username, password);
        // otherwise remove the existing cookie, that might be present
        else
            deleteCookie(res);
        req.session.destroy();
        res.redirect('/login');
    }
    /**
     * Tries to read the account info cookie and return it's content. If the cookie couldn't be
     * read or doesn't exist, undefined is returned instead.
     *
     * @method getCookie
     * @param (object) [req] The node request object.
     * @return (object) The resulting account info object or undefined.
     */
    function getCookie(req) {
        var raw = req.cookies.get(_cookieName);
        if (raw === undefined)
            return undefined;
        // TODO: Decrypt raw data
        var acc = JSON.parse(raw);
        return acc;
    }
    /**
     * Saves the provided unsername and password into a new account info cookie. The password
     * should be a hash and not the plain-text password.
     *
     * @method setCookie
     * @param (object) [res] The node response object.
     * @param (string) [username] The username which should be saved in the cookie.
     * @param (string) [password] The password which should be saved in the cookie.
     */
    function setCookie(res, username, password) {
        var obj = { username: username, password: password };
        var raw = JSON.stringify(obj);
        // TODO: Encrypt raw data
        res.cookies.set(_cookieName, raw, { maxAge: _maxCookieAge });
    }
    /**
     * Removes the account info cookie.
     *
     * @method deleteCookie
     * @param (object) [res] The node response object.
     */
    function deleteCookie(res) {
        // setting the cookie without providing a value should delete that cookie, by setting an
        // appropriate expire date
        res.cookies.set(_cookieName);
    }
    /**
     * Gets the account data for the specified username out of the database.
     *
     * @param (string) [username] The name of the user which data should be got.
     * @param (function) [callback] The callback function which is called after the data has been
     *  retrieved from the database. The function takes two parameters, the first one is an error
     *  object and the second one ise the account info object.
     */
    function getAccountData(username, callback) {
        var sql = 'SELECT * FROM kd_account WHERE kd_account.acc_username = \'' + username + '\'';
        db.query(sql, function(err, rows, fields) {
            // pass database error to the callback so the calling function can deal with it
            // appropriately
            if (err) {
                callback(err, undefined);
                return;
            }
            // if there are zero rows returned, the username was wrong, if there is more than one
            // row returned something went horribly wrong, because usernames should be unique
            if (rows.length != 1) {
                callback(undefined, undefined);
                return;
            }
            // after everything went fine, create the account data object end pass it to the
            // callback
            var result = {
                username: rows[0]['acc_username'],
                password: rows[0]['acc_password'],
                salt : rows[0]['acc_salt']};
            callback(undefined, result);
        });
    };
    /**
     * Calculates the password hash of the given password and salt.
     *
     * @param (string) [password] The password which should be hashed.
     * @param (string) [salt] The salt which is appended to the password.
     * @result (string) The resulting password hash.
     */
    function getPasswordHash(password, salt) {
        var crypto = require('crypto');
        var hash = crypto.createHash(_hashAlgorithm);
        // the password is appended by the salt to create the string that is hashed
        hash.update(password + salt, _hashEncoding);
        // and converted to a hex string, which will now contain random chars consisting of the
        // numbers from 0 to 9 and the letters a to f
        var buffer = hash.digest('hex');
        return passwordHash = buffer.toString(_hashEncoding);
    };
    /**
     * Creates a new random salt string which can be used to create a new account.
     *
     * @param (function) [callback] The callback function which is called after the new salt string
     *  has been created. The only parameter of the function is a string which contains the created
     *  salt.
     */
    function CreateSalt(callback) {
        var hashSaltLength = 64;
        // using sha 256 will result in a 64 byte has, which is exactly the same length as the
        // corresponding field in the database
        var hashSaltAlgorithm = 'sha-256';
    
        var crypto = require('crypto');
        crypto.randomBytes(_hashSaltLength, function(ex, buf) {
            // convert the data to a string - the string will contain mostly garbage, but it's
            // just used to feed the hash function, so this shouldn't be a problem
            var saltBuff = buf.toString(_hashEncoding);
            // hash the salt string
            var saltHash = crypto.createHash(hashSaltAlgorithm);
            saltHash.update(saltBuff, 'binary');
            // and convert it to a hex string, which will now contain random chars consisting of the
            // numbers from 0 to 9 and the letters a to f
            var salt = saltHash.digest('hex');
            callback(salt.toString(_hashEncoding));
        });
    };
    /**
     * Helper function which displays the login page with the specified status.
     *
     * @param {object} [req] Node req object.
     * @param {object} [res] Node response object.
     * @param (string) [state] The with which the login page should be displayed.
     */
    function renderLoginPage(req, res, state) {
        res.render('login', { title: 'Login', state: state});
    };
    
    return module;
};
