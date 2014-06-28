module.exports = function() {

    // Handles 404 errors
    //
    // for this function to work, it's important that it's
    // the last route registered within the app, so it only
    // gets called after every other possible route has failed.
    module.err404 = function(req, res, next) {
        showErrorPage(res, 404, lang.get('errors', 'msg404', req.url), 'requested url: ' + req.url);
    };

    // Generic error handler, which handles all errors
    // not already handled by other means. Displays the
    // error page with an generic 500 error.
    module.generic = function errorHandler(err, req, res, next) {
        showErrorPage(res, 500, lang.get('errors', 'msg500'), 'unknown error');
    };

    // Renders the error page with the specified status and message,
    // also posts the specified notification message to the console log.
    function showErrorPage(res, status, pageMsg, logMsg) {
        var err = {
            status : status,
            message : pageMsg
        };

        if (err.status === 404) {
            res.status(404);
        }

        res.render('error', { error: err, lang: lang });
        console.log('! Error ' + status + ': ' + logMsg);
    }

    // registers a number of debug routes which can be used to test
    // the corresponding error handlers.
    module.registerDebugRoutes = function(app) {
        app.get('/400', function(req, res) {
            next();
        });
        app.get('/500', function(req, res) {
            next(new Error());
        });
    };

    return module;
};
