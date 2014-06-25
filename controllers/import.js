module.exports = function() {

	module.index = function(req, res) {
		res.render('import', { title: 'Import' });
	};
	
    return module;
};