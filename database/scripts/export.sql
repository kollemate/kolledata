-- Experimental Query (!) to export a table as csv-file
-- works (currently on windows but path can be changed) but 'no value' in a field is represented as "\N" which has to be manually replaced afterwards with "" to get a clean output 

SELECT * INTO OUTFILE 'C:\\result.csv'
FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"'
ESCAPED BY '\\'
LINES TERMINATED BY '\n'
FROM kolledata.kd_company;