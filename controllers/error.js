/**
 * Responsible for all error handling. Catches 404s and other http error and presents the user
 * with an error page. Also writes the error to the internal log.
 *
 * @class error
 * @constructor
 */
module.exports = function() {

    /**
     * Handles 404 error. This is not an explicit error handler, but a normal route.
     * For this function to work, it's important that it's the last route registered
     * within the app, so it only gets called after every other possible route has
     * failed.
     * 
     * @method err404
     * @param {object} [req] Node reqest object.
     * @param {object} [res] Node response object.
     * @param {method} [next] Method to call the next route or error.
     */
    module.err404 = function(req, res, next) {
        var dict = lang.getDictionaryFromRequestHeader(req);
        res.status(404);
        showErrorPage(res, 404, dict.get('errors', 'msg404', req.url), 'requested url: ' + req.url, dict);
    };
    
    /**
     * Handles database errors, which are identified by the err parameter being a string
     * containing the text 'db error'. If thats not the case, a generic error is triggered
     * instead.
     * Displays the error page with the generic 500 error and an info, that the connection
     * to the database has failed.
     *
     * @method errDb
     * @param {object} [err] Node error object.
     * @param {object} [req] Node req object.
     * @param {object} [res] Node response object.
     * @param {method} [next] Method to call the next route or error.
     */
    module.errDb = function(err, req, res, next) {
        if (err === undefined || err !== 'db error')
            return next();
        var dict = lang.getDictionaryFromRequestHeader(req);
        res.status(500);
        showErrorPage(res, 500, dict.get('errors', 'msgDb', req.url), 'Database error', dict);
    };

    /**
     * Generic error handler, which handles all errors not already handled by other measn.
     * Displays the error page with the generic 500 error.
     *
     * @method generic
     * @param {object} [err] Node error object.
     * @param {object} [req] Node req object.
     * @param {object} [res] Node response object.
     * @param {method} [next] Method to call the next route or error.
     */
    module.generic = function errorHandler(err, req, res, next) {
        var dict = lang.getDictionaryFromRequestHeader(req);
        res.status(500);
        showErrorPage(res, 500, dict.get('errors', 'msg500'), 'unknown error', dict);
    };

    /**
     * Internal method that renders the error page with the specified status and message.
     * Also writes the specified notification to the internal log.
     *
     * @method showErrorPage
     * @param {object} [res] Node response object. Used to render the error page.
     * @param {int} [status] The error state that should be displayed (404, 500 etc.).
     * @param {string} [pageMsg] The message that is shown on the error page.
     * @param {string} [logMsg] The message that is written to the internal log.
     * @param {object} [dict] The dictionary which is passed to the error page to support
     *   multi-language capabilities.
     */
    function showErrorPage(res, status, pageMsg, logMsg, dict) {
        // create an error object, which is used by the error page
        // to display the error status and message
        var err = {
            status : status,
            message : pageMsg
        };

        res.render('error', { error: err, dict: dict });
        console.log('! Error ' + status + ': ' + logMsg);
    }

    // registers a number of debug routes which can be used to test
    // the corresponding error handlers.
    /**
     * Registers a number of debug routes which can be used to test the corresponding error
     * handlers. This should be used for debug purposes only and not be part of the release build.
     *
     * @method registerDebugRoutes
     * @param {object} [app] The express object which is used to register the routes.
     */
    module.registerDebugRoutes = function(app) {
        app.get('/err404', function(req, res) {
            next();
        });
        app.get('/err500', function(req, res) {
            next(new Error(), req, res);
        });
    };

    return module;
};
