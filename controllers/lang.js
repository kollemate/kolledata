module.exports = function() {

    /**
     * The paths to all available language files, indexed by their IETF language tag
     * (which hopefully should also be the one used by the browsers request header).
     * This also defines which different languages are supported.
     *
     * @property paths
     * @type object
     * @final
     */
    const _paths = {
        en : './languages/english.json',
        de : './languages/german.json',
        
        // The path to the default dictionary, which is used if the requested
        // dictionary wasn't found.
        default : './languages/english.json'
    }
    
    /**
     * The library object, where all loaded dictionary get stored, indexed by their
     * ETF language tag.
     *
     * @property _dicts
     * @type object
     */
    var _dicts = { };
    
    /**
     * This methods gets added to each dictionary after it has been loaded.
     * It will try to find the string with the specified category and key.
     *
     * It's also possible to feed additional arguments to method, which can be used to replace
     * special variable indicators in the retrieved string. These indicators have the syntax of
     * %n, where n is a consecutive number beginning with zero. The indicators must be defined in
     * the corresponding entry in the language files. The first additional argument will replace
     * %0, the second %1 and so on.
     *
     * @method dictGet
     * @category {string} The category of the string that should be got.
     * @key {string} The key within the category which should be got.
     * @return {string} the retrieved language string.
     */
    var dictGet = function(category, key) {
        console.log(category);
        console.log(key);
        // if no category or key was not defined, there is nothing to be got, so throw an error
        if (category === undefined || key === undefined)
            throw 'ERROR - dict.get: No category or key specified';
        // if category and key were defined, but are not part of the dictionary, also throw an error
        if (this[category] === undefined || this[category][key] === undefined)
            throw 'ERROR - dict.get: The specified category or key wasn\'t found in the dictionary';
        var str = this[category][key];
        // replace every var identifier (%0, %1 etc.) in the language string with the string
        // specified in the additional arguments (>2)
        for (var i = 2; i < arguments.length; i++)
            str = str.replace('%' + (i - 2), arguments[i]);
        return str;
    }
    
    /**
     * Load the language file with the specified IETF language tag
     * 
     * @method load
     * @tag {string} The IETF language tag of the dictionary that should be loaded
     * @return {boolean} TRUE if the file for the specified tag was successfully loaded,
     *  otherwise FALSE
     */
    module.loadDictionary = function(tag) {
        // if there is no registered path for the tag, there is nothing to load
        if (_paths[tag] === undefined)
            return false;
        try {
            // load the required module, read the json file and parse it, hopefully creating
            // the dictionary
            var fs = require('fs');
            var raw = fs.readFileSync(_paths[tag], 'utf8');
            var dict = JSON.parse(raw);
            // and since this is javascript, we just glue a get function to the previously created
            // dictionary, that can be used to retrieve a string and replace some special var id's.
            // Makes one feel really dirty, but oh well...
            dict.get = dictGet;
            // finally if everything went smooth, save the created
            // dictionary in the library
            _dicts[tag] = dict;
            return true;
        }
        catch(err) {
            // if something went wrong, simply dump everything to the log and return
            console.log(err);
            return false;
        }
    }
    
    /**
     * Get the dictionary with the specified IETF language tag. If the dictionary wasn't already
     * loaded, it gets loaded now. If the dictionary for the specified tag couldn't be loaded,
     * the default dictionary is returned instead.
     *
     * @method getDictionary
     * @tag {string} The IETF language tag of the dictionary that should be got.
     * @return {object} The desired dictionary or the default dictionary.
     */
    module.getDictionary = function(tag) {
        // if the dictionary for the tag was already loaded, simply return it
        if (_dicts[tag] !== undefined)
            return _dicts[tag];
        // otherwise check if its defined and return it, if it was successfully loaded
        if (_paths[tag] !== undefined && this.loadDictionary(tag) === true)    
            return _dicts[tag];
        // if that also fails, check if at least the default dictionary was loaded,
        // and try to load it, if thats not the case. If this fails we're in trouble,
        // because there is no fallback for the fallback.
        if (_dicts['default'] === undefined)
            this.loadDictionary('default');
        return _dicts['default'];
    }
    
    /**
     * Gets an appropriate dictionary for the 'accept-language' attribute in the request headers.
     * Tries to find the language that is preferred the most. If none of the preferred languages
     * is supported, the default dictionary is returned instead.
     *
     * @method getDictionaryFromRequestHeader
     * @req {object} The request object, containing the request headers.
     * @return {object} An appropriate dictionary for the preferred languages or the default
     *  dictionary if no other could be found.
     */
    module.getDictionaryFromRequestHeader = function(req) {
        // the accept-language entry of the header should be a string in the following format:
        // 'de,en-US;q=0.7,q=0.3'
        // so what we need to do is get the language tags out of that string and check, if we're
        // supporting them. Assuming the languages have been ordered by their q values, we can get
        // away with not actually checking these, just taking the tags into account.
        
        // first split the string at the semicolon to get only the language tags, than split these
        // again by commas to get them in an array which is iterateable
        var tags = req.headers["accept-language"].split(';')[0].split(',');
        // now we check for each tag if it's supported
        for (var i = 0; i < tags.length; i++)
        {
            var tag = tags[i];
            // if the current tag is a subset of a bigger language (like 'en-US' is for 'en')
            // the special part is ignored
            // so check if there is the character '-', and if thats the case only use the
            // part before the '-' as the actual tag
            var j = tag.indexOf('-')
            if (j !== -1)
                tag = tag.substr(0, j);
            // if the tag is supported, return the corresponding dictionary
            if (_paths[tag] !== undefined)
                return this.getDictionary(tag);
        }
        // if none of the tags was supported, return the default dictionary
        return getDictionry('default');
    }
    
    /**
     * Get the language string with the specified category and key from the dictionary with the
     * specified IETF language tag. If the dictionary with the specified key wasn't available,
     * the default dictionary is used instead.
     * (Internally this simply calls the get method of the dictionary.)
     *
     * @method getString 
     * @tag {string} The IETF language tag of the dictionary from which the string should be got.
     * @category {string} The category of the string that should be got.
     * @key {string} The key within the category which should be got.
     * @return {string} the retrieved language string.
     */
    module.getString = function(tag, category, key) {
        // get either the requested or the default dictionary
        var dict = this.getDictionary(tag);
        // transform arguments into an array and remove the first element,
        // which is the language tag
        var newArgs = Array.prototype.slice.call(arguments).slice(1);
        // then call the method with the new arguments array - this makes sure all additional
        // arguments besides the language tag are passed to the dictionary's get method
        // simply return the result of the dictionary's get method - it will throw errors,
        // if category or key were invalid, so there's no need to check that here also
        return dictGet.apply(dict, newArgs);
    }

    return module;
}
