/**
 * Responsible for handling all account related issues like logging in users,
 * creating account cookies etc.
 *
 * @class account
 * @constructor
 */
module.exports = function() {
	// TODO: Reimplement password encryption with OAuth

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
     * Dev method for creating the admin account, this method will remove the existing
     * admin account if there is on and create a new one with the deault password.
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
            
            var hash1 = crypto.createHash('sha256');
            hash1.update('password', _hashEncoding);
            var buffer1 = hash1.digest('hex');
            var passwordHash1 = buffer1.toString(_hashEncoding);
            console.log('pass1: ' + passwordHash1);
            
            var hash2 = crypto.createHash('sha512');
            hash2.update(passwordHash1 + salt, _hashEncoding);
            var buffer2 = hash2.digest('hex');
            var passwordHash2 = buffer2.toString(_hashEncoding);
            console.log('pass2: ' + passwordHash2);
            
            var sql = 'DELETE FROM kd_account WHERE acc_username = \'admin\'; INSERT INTO kd_account (acc_username, acc_password, acc_salt) VALUES (\''
                + 'admin' + '\', \'' + passwordHash2 + '\', \'' + salt + '\');';
            db.query(sql, function(err, rows, fields) {
                if (err) {
                    console.log(err);
                    return next('db error');
                    }
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
     * Displays the change password page.
     *
     * @method changePasswordGet
     * @param {object} [req] Node req object.
     * @param {object} [res] Node response object.
     * @param (object) [next] Node next object.
     */   
    module.changePasswordGet = function(req, res, next) {
        res.render('Accounts/changePassword', { title: 'Change Password'});
    }
    /**
     * Checks if the old password of the user was correct and the new password
	 * and it's confirmation match. Creates a new salt for the account, hashes
	 * the password and stores it in the database. Also updates the session
	 * variables accordingly.
     *
     * @method changePasswordPost
     * @param {object} [req] Node req object.
     * @param {object} [res] Node response object.
     * @param (object) [next] Node next object.
     */
    module.changePasswordPost = function(req, res, next) {
		var username = req.session.username;
		var oldPassword = req.body.oldPassword;
		var password1 = req.body.newPassword;
		var password2 = req.body.confirmPassword;
		// check first if the new passwords and it's confirmation match,
		// because this requires no db query
		if (password1 !== password2) {
			res.render('Accounts/changePassword', { title: 'Change Password', state: 'confirmWrong'});
			return next();
		}
		// next, get the account data from the database
		getAccountData(username, function(err, accData) {
			if (err)
				return next('db error');
			// and check if the hash of the entered old password matches the hash
			// stored in the database
			var oldPwdHash = getPasswordHash(oldPassword, accData.salt);
			if (oldPwdHash != accData.password) {
				res.render('Accounts/changePassword', { title: 'Change Password', state: 'wrongPassword'});
				return next();
			}
			// if thats the case, we can store the new password, for which we also
			// need a new salt (well, technically we could reuse the old one, but
			// creating a new one is better)
			createSalt(function(salt) {
				var newPwdHash = getPasswordHash(password1, salt);
				var sql = 'UPDATE kd_account SET acc_password = ?, acc_salt = ? WHERE acc_username = \'' + username + '\';';
				var data = [newPwdHash, salt];
				db.query(sql, data, function(err, rows, fields) {
					if (err) {
						return next('db error');
                    }
					// if everything went fine, update the session variable and show the user
					// a corresponding success message
					req.session.password = newPwdHash;
					res.render('Accounts/changePassword', { title: 'Change Password', state: 'success'});
				});
			});
			
		});
    }
    /**
     * Checks if the current user is the admin and displays a the
	 * create new account page if thats the case.
     *
     * @method createAccountGet
     * @param {object} [req] Node req object.
     * @param {object} [res] Node response object.
     * @param (object) [next] Node next object.
     */
    module.createAccountGet = function(req, res, next) {
		// only the admin account is allowed to create new accounts, so display
		// a corresponding message if any other user tries to create one
		if (req.session.username != 'admin') {
			res.render('Accounts/createAccount', { title: 'Create Account', state: 'adminError' });
			return next();
		}
        res.render('Accounts/createAccount', { title: 'Create Account'});
    }
    /**
     * Checks if the current user is the admin, if the entered username
	 * is not already in the database and if the entered password and it's
	 * confirmation match. If thats the case, a new salt is created, the
	 * password is hashed and a new entry for the account is added to the
	 * database.
     *
     * @method createAccountPost
     * @param {object} [req] Node req object.
     * @param {object} [res] Node response object.
     * @param (object) [next] Node next object.
     */
    module.createAccountPost = function(req, res, next) {
		// only the admin account is allowed to create new accounts, so display
		// a corresponding message if any other user tries to create one
		if (req.session.username != 'admin') {
			res.render('Accounts/createAccount', { title: 'Create Account', state: 'adminError' });
			return next();
		}
		var username = req.body.username;
		var password1 = req.body.newPassword;
		var password2 = req.body.confirmPassword;
		// first check if the entered password and its confirmation match, because that
		// requires no database query
		if (password1 != password2) {
			res.render('Accounts/createAccount', { title: 'Create Account', state: 'confirmWrong' });
			return next();
		}
		// next, check if the entered username is not already in the database
		var sql1 = 'SELECT * FROM kd_account WHERE acc_username = \'' + username + '\';';
		db.query(sql1, function (err, rows, fields) {
			if (err)
				return next('db error');
			// if the username is not in the db, the query should return exactly zero rows,
			// if it's in the db, the query should return exactly one row
			if (rows.length != 0) {
				res.render('Accounts/createAccount', { title: 'Create Account', state: 'usernameDuplicate' });
				return next();
			}
			// after we've made sure the username is unique, we need to create some salt
			// for the new account
			createSalt(function(salt) {
				// and hash the password with the newly created salt
				var passwordHash = getPasswordHash(password1, salt);
				var sql2 = 'INSERT INTO kd_account (acc_username, acc_password, acc_salt) VALUES (\''
					+ username + '\', \'' + passwordHash + '\', \'' + salt + '\');';
				// so that we can finally add a new entry to the database,
				// so much asynchronous fun....
				db.query(sql2, function(err, rows, fields) {
					if (err) {
                        console.log(err);
						return next('db error');
                    }
					res.render('Accounts/createAccount', { title: 'Create Account', state: 'success'});
				});
			});
		});
    }
    /**
     * Checks if the current user is not admin (which can't be deleted) and displays
	 * a confirmation page, if thats not the case.
     *
     * @method deleteAccountGet
     * @param {object} [req] Node req object.
     * @param {object} [res] Node response object.
     * @param (object) [next] Node next object.
     */
	module.deleteAccountGet = function(req, res, next) {
		// the admin account can't be removed, so if a user tries that, display
		// a corresponding error message
		if (req.session.username == 'admin') {
			res.render('Accounts/deleteAccount', { title: 'Delete Account', state: 'adminError' });
			return next();
		}
		// otherwise display a conformation page to make sure the user isn't
		// accidentally deleting the account
		res.render('Accounts/deleteAccount', { title: 'Delete Account', state: 'confirm' });
	}
    /**
     * If the current user is not the admin and the user has confirmed the removal,
	 * the corresponding account is removed from the database and the user gets
	 * redirected to the login page.
     *
     * @method deleteAccountPost
     * @param {object} [req] Node req object.
     * @param {object} [res] Node response object.
     * @param (object) [next] Node next object.
     */
	module.deleteAccountPost = function(req, res, next) {
		// the admin account can't be removed, so if a user tries that, display
		// a corresponding error message
		if (req.session.username == 'admin') {
			res.render('Accounts/deleteAccount', { title: 'Delete Account', state: 'adminError' });
			return next();
		}
		// if the account was any other than the admin account, and the user confirmed the removal,
		// the corresponding entry is deleted from the database
		var sql = 'DELETE FROM kd_account WHERE acc_username = \'' + req.session.username + '\';';
		db.query(sql, function(err, rows,fields) {
			if (err)
				return next('db error');
			deleteCookie(res);
			req.session.destroy();
			res.redirect('/login');
		});
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
        var sql = 'SELECT * FROM kd_account WHERE kd_account.acc_username = \'' + username + '\';';
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
    function createSalt(callback) {
        var hashSaltLength = 64;
        // using sha 256 will result in a 64 byte has, which is exactly the same length as the
        // corresponding field in the database
        var hashSaltAlgorithm = 'sha256';
    
        var crypto = require('crypto');
        crypto.randomBytes(hashSaltLength, function(ex, buf) {
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
        res.render('Accounts/login', { title: 'Login', state: state});
    };
    
    return module;
};
