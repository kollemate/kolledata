/**
 * Responsible for importing CSV files into the database.
 *
 * @class import
 * @constructor
 */
module.exports = function(db) {
    /**
     * The busboy instance for handling file transfers.
     *
     * @property Busboy
     * @type object
     */
    var Busboy = require('busboy');
    /**
     * Constant integer that dertermines the number of columns in the csv file, this should allways
     * match with the number of properties in the _header object below.
     *
     * @property _numberOfColumns
     * @type int
     * @final
     */
    const _numberOfColumns = 24;
    /**
     * Object that contains the column number of each attribute field for easier access.
     *
     * @property _headers
     * @type object
     * @final
     */
    const _headers = {
        Nr : 0,             // - ignored -
        Anrede : 1,         // kd_person.per_salutation
        Titel : 2,          // kd_person.per_academic_title
        Vorname : 3,        // kd_person.per_firstname
        Name : 4,           // kd_person.per_name
        Firma : 5,          // kd_company.com_name
        Abteilung : 6,      // kd_person.per_department
        Strasse : 7,        // kd_company.com_address
        PLZ : 8,            // kd_company.com_postcode
        Ort : 9,            // kd_company.com_city
        Bemerkung : 10,     // kd_person.per_memo
        Telefon : 11,       // kd_person.per_phone1, kd_company.com_phone1
        Telefax : 12,       // kd_person.per_fax, kd_company.com_fax
        EMail : 13,         // kd_person.per_email, kd_company.com_email1
        KontoNr : 14,       // kd_bank_accounts.ba_account_cumber
        BLZ : 15,           // kd_bank_accounts.ba_bank_code
        IBAN : 16,          // kd_bank_accounts.ba_IBAN
        BIC : 17,           // kd_bank_accounts.ba_BIC
        Bankname : 18,      // kd_bank_accounts.ba_bank_name
        Steuernummer : 19,  // kd_bank_accounts.ba_tax_number
        UStIdNr : 20,       // kd_bank_accounts,ba_sales_tax_ident_number
        Telefon2 : 21,      // kd_person.per_phone2, kd_company.com_phone2
        Web : 22,           // kd_person.per_url, kd_company.com_url
        Vermittler : 23     // kd_person.per_referredBy
    }
    /**
     * Default handler for get requests.
     *
     * @method index
     * @param {object} [req] Node req object.
     * @param {object} [res] Node response object.
     */
    module.index = function(req, res) {
        var dict = lang.getDictionaryFromRequestHeader(req);
        res.render('import', { title: 'Import', dict: dict });
    };
    /**
     * Default handler for post requests.
     * Handles the CSV file upload.
     *
     * @method handleUpload
     * @param {object} [req] Node req object.
     * @param {object} [res] Node response object.
     */
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
            file.on('data', function(data) { parseResult = parseData(req, res, data); });
        });
        
        // after all has been finished by busboy, do nothing since we have to wait for the
        // database to signal that everything went fine.
        busboy.on('finish', function() {
        });
        
        req.pipe(busboy);
    };
    /**
     * Parses the data from the CSV file. Creates an SQL query containing all the data from
     * the file and sends the query to the database.
     *
     * @method parseData
     * @param {object} [req] Node req object.
     * @param {object} [res] Node response object.
     * @param {string} [data] A string representing the data of the CSV file.
     */
    function parseData(req, res, data) {
        console.log('CSV import has been started ...');
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
            console.log(' > file didn\'t have the right number of columns.')
            console.log(' > (expected ' + _numberOfColumns + ', got ' + _headerLine.length + ')');
            console.log(' > CSV import aborted!\n');
            renderPage(req, res, 'error');
            return;
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
                console.log(' > unexpected column header at column ' + i);
                console.log(' > (expected ' + headerStrings[i] + ', got' + headerLine[i] + ')');
                console.log(' > CSV import aborted!\n');
                renderPage(req, res, 'error');
                return;
            }
        // --------------------
        
        // --------------------
        // after the headers have been validated, we can begin to create the sql query from the
        // data provided by the csv file
        var queryText = '';
        for (var i = 1; i < lines.length; i++) {
            queryText += parseLine(lines[i]);
        }
        console.log('>>> The CSV file was parsed successfully...');
        // --------------------
        
        // TODO: sanitize csv data...
        // Because of the asynchronous nature of node.js, we have the shove the req and res
        // objects all the way to here, because only in the asynchronous callback of the
        // database query we will know if the whole import was successful or not and therefore
        // determine, if we must render an error or success page for the user ... what joy
        db.query(queryText, function(err, rows, fields){
            if (err) {
                console.log(' > ... but could not send query to the database:');
                console.log(err);
                console.log(' > CSV import aborted!\n');
                renderPage(req, res, 'error');
            } else {
                console.log(' > ... and was successfully inserted into the database');
                console.log(' > CSV import finished!');
                renderPage(req, res, 'success');
            }
        });
    }
    /**
     * Parses a single line of the CSV file an creates the corresponding SQL query for that line.
     *
     * @method parseLine
     * @param {string} [line] A string representing the line of the CSV file.
     * @return {string} The resulting SQL Query for the line.
     */
    function parseLine(line) {
        if (line == '')
            return '';
        line = line.split(';')
        var sql =
        // insert all company data
              'INSERT INTO kd_company (com_name, com_email1, com_phone1, com_phone2, com_fax, '
            + 'com_city, com_postcode, com_address, com_url, com_memo, com_timestamp'
            + ') VALUES (\''
            + line[_headers.Firma] + '\', \'' + line[_headers.EMail] + '\', \''
            + line[_headers.Telefon] + '\', \'' + line[_headers.Telefon2] + '\', \''
            + line[_headers.Telefax] + '\', \'' + line[_headers.Ort] + '\', \''
            + line[_headers.PLZ] + '\', \'' + line[_headers.Strasse] + '\', \''
            + line[_headers.Web] + '\', \'\', NOW()); '
        // insert all person data
        // NOTE: the field for the referee is ignored, because it very likely contains non
        // atomic data which would require further processing (and a lot of guesswork)
            + 'INSERT INTO kd_person (per_salutation, per_academic_title, per_name, per_firstname, '
            + 'per_fax, per_email1, per_phone1, per_phone2, per_url, per_memo, per_company, '
            + 'per_department, per_referredBy, per_timestamp'
            + ') VALUES (\''
            + line[_headers.Anrede] + '\', \'' + line[_headers.Titel] + '\', \''
            + line[_headers.Name] + '\', \'' + line[_headers.Vorname] + '\', \''
            + line[_headers.Telefax] + '\', \'' + line[_headers.EMail] + '\', \''
            + line[_headers.Telefon] + '\', \'' + line[_headers.Telefon2] + '\', \''
            + line[_headers.Web] + '\', \'' +  line[_headers.Bemerkung]
            + '\', LAST_INSERT_ID(), \'' + line[_headers.Abteilung] + '\', 0, NOW()); '
        // finally the line has been parsed, what a fun
        return sql;
    }
    /**
     * Helper method for rendering the request response page.
     *
     * @method renderPage
     * @param {object} [req] Node req object.
     * @param {object} [res] Node response object.
     * @param {string} [result] The result of the import which should be displayed.
     *   Possible values are 'success' and 'error'.
     */
    function renderPage(req, res, result) {
        var dict = lang.getDictionaryFromRequestHeader(req);
        res.render('import', { title: 'Import', dict: dict, state: result});
        res.end();
    }

    return module;
};