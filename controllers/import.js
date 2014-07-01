module.exports = function() {

	module.index = function(req, res) {
        var dict = lang.getDictionaryFromRequestHeader(req);
		res.render('import', { title: 'Import', dict: dict });
	};
    
    module.handleUpload = function(req, res) {
        console.log(req.files);
    };
	
    return module;
};