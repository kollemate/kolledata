module.exports = function() {

	module.index = function(req, res) {
        var dict = lang.getDictionaryFromRequestHeader(req);
		res.render('import', { title: 'Import', dict: dict });
	};
	
    return module;
};