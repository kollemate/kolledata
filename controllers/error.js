module.exports = function() {

    // generic fallback GET request callback
    // 
    // if this gets called this means the request was not handled by any
    // other registered callback, which basically means a 404 error has
    // occurred
    module.fallback = function(req, res, next) {
        var err = new Error();
        err.status = 404;
        next(err);
    };
    
    // generic error handler, which handles every error by
    // simply displaying an error page with the error code
    module.generic = function errorHandler(err, req, res, next) {
        res.render('error', { error: err });
        next(err);
    };
    
    return module;
};