module.exports = function() {

    var Busboy = require('busboy');
    
    const _numberOfColumns = 24;
    
    const _headers = {
        Nr : 0,
        Anrede : 1,
        Titel : 2,
        Vorname : 3,
        Name : 4,
        Firma : 5,
        Abteilung : 6,
        Straße : 7,
        PLZ : 8,
        Ort : 9,
        Bemerkung : 10,
        Telefon : 11,
        Telefax : 12,
        EMail : 13,
        KontoNr : 14,
        BLZ : 15,
        IBAN : 16,
        BIC : 17,
        Bankname : 18,
        Steuernummer : 19,
        UStIdNr : 20,
        Telefon2 : 21,
        Web : 22,
        Vermittler : 23
    }

    module.index = function(req, res) {
        var dict = lang.getDictionaryFromRequestHeader(req);
        res.render('import', { title: 'Import', dict: dict });
    };

    module.handleUpload = function(req, res) {
        var busboy = new Busboy({ headers: req.headers });
        // this will contain the result of the parsing of the csv file and will be passed
        // to import.jade to produce the correct notification for the user
        var parseResult;
        // this will handle all file-fields that have been uploaded, of which there should
        // be exactly one (with the fieldname 'csvFile', specified in import.jade).
        // The filename is unimportant, the encoding information is useless (will always be '7bit')
        // and the mimetype will always be an octet-stream, because we receive a stream of bytes.
        // So, we will proceed by simply trying to parse the data stream.
        busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
            file.on('data', function(data) { parseResult = parseData(data); });
        });
        
        // after all has been finished render the page with the correct notification
        busboy.on('finish', function() {
            //res.writeHead(303, { Connection: 'close', Location: '/import' });
            var dict = lang.getDictionaryFromRequestHeader(req);
            res.render('import', { title: 'Import', dict: dict, state: parseResult});
            res.end();
        });
        
        req.pipe(busboy);
    };
    
    function parseData(data) {
        console.log('csv import has been started');
        // convert the byte array to a string
        // (there might probably be a better way to do this)
        var stringData = "";
        for (var i = 0; i < data.length; i++) {
            // ignore apostrophes within the stream, because the will most likely be used to
            // indicate string values, which we don't need, because we already converting
            // everything to a string - if we don't ignore them here, we will have to remove
            // them later
            if (data[i] == 39)
                continue;
            stringData += String.fromCharCode(data[i]);
        }
        // split the string at line breaks to get an array of every line
        // (split at both line feed only and carriage return and line feed)
        var lines = stringData.split(/\n|\r\n/);
        
        // --------------------
        // Validate the header of the csv file to check if the content might be correct
        // (could still be garbage, but the possibility that it's not garbage will be higher)
        // Split the line by semicolons to get an array of every column identifier
        var headerLine = lines[0].split(';');
        // check if the number of lines/columns is correct
        if (headerLine.length != _numberOfColumns) {
            // TODO: print error page
            console.log('|- file didn\'t have the right number of columns.')
            console.log('|- (expected ' + _numberOfColumns + ', got ' + _headerLine.length + ')');
            console.log('|- aborting csv import...\n');
            return 'error';
        }
        // check for every column of the first header line, if they match the expected header
        // string as defined in 'headerStrings'. If they don't match, the csv file is considered
        // to be invalid and the import is aborted.
        // (can't use the keys of '_headers' because 'E-Mail' etc. contain a minus, which the
        // '_headers' equivalent don't)
        var headerStrings = ['Nr','Anrede','Titel','Vorname','Name','Firma','Abteilung','Straße',
            'PLZ','Ort','Bemerkung','Telefon','Telefax','E-Mail','KontoNr','BLZ','IBAN','BIC',
            'Bankname','Steuernummer','USt-IdNr.','Telefon2','Web', 'Vermittler'];
        for (var i = 0; i < _numberOfColumns; i++)
            if (headerStrings[i] != headerLine[i]) {
                // TODO: print error page
                console.log('|- unexpected column header at column ' + i);
                console.log('|- (expected ' + headerStrings[i] + ', got' + headerLine[i] + ')');
                console.log('|- aborting csv import...\n');
                return 'error';
            }
        // --------------------
        
        // --------------------
        // after the headers have been validated, we can begin to create the sql query from the
        // data provided by the csv file
        
        var query = '';
        for (var i = 1; i < lines.length; i++) {
            
        }
        // --------------------
        console.log('|- csv inport finished successfully\n');
        return 'success';
    }

    return module;
};