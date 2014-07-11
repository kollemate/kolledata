module.exports = function() {

    var Busboy = require('busboy');

    module.index = function(req, res) {
        var dict = lang.getDictionaryFromRequestHeader(req);
        res.render('import', { title: 'Import', dict: dict });
    };

    module.handleUpload = function(req, res) {
        var busboy = new Busboy({ headers: req.headers });
        // this will handle all file-fields that have been uploaded, of which there should
        // be exactly one (with the fieldname 'csvFile', specified in import.jade).
        // The filename is unimportant, the encoding information is useless (will always be '7bit')
        // and the mimetype will always be an octet-stream, because we receive a stream of bytes.
        // So, we will proceed by simply trying to parse the data stream.
        busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
            file.on('data', parseData);
        });
        
        busboy.on('finish', function() {
            res.writeHead(303, { Connection: 'close', Location: '/import' });
            res.end();
        });
        
        req.pipe(busboy);
    };
    
    function parseData(data) {
        // convert the byte array to a string
        // (there might probably be a better way to do this)
        var stringData = "";
        for (var i = 0; i < data.length; i++) {
            stringData += String.fromCharCode(data[i]);
        }
        // for now just print the whole thing
        console.log(stringData);
    }

    return module;
};