module.exports = function() {

    var _dict = null;

    module.load = function(file) {
        var fs = require('fs');
        var raw = fs.readFileSync(file, 'utf8');
        _dict = JSON.parse(raw);
    }
    
    module.get = function(category, key) {
        if (_dict === null)
            throw 'ERROR - lang.load: No Language File';
        if (category === undefined || key === undefined)
            throw "ERROR - lang.load: No category or key specified";
        // get the language string from the dictionary
        var str = _dict[category][key];
        // replace every var identifier (%0, %1 etc.) in the language
        // string with the string specified in the arguments
        for (var i = 2; i < arguments.length; i++)
            str = str.replace('%' + (i - 2), arguments[i]);
        return str;
    }

    return module;
}
