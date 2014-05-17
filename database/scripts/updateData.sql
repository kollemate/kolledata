-- No real scripts (!), just examples showing what you must do to update data to a specific table. The capitalized strings have to be replaced by real data from user input. You don't need to insert, update or delete the history-tables manually.
-- Don't replace NOW()!
-- You don't have to update all of the fields, just the ones that the user has changed! Just erase the name and the value from the query. The examples below will update all of them for demonstration.

-- (1) To make sure no one executes this with changes to the database
START TRANSACTION;

-- Company
UPDATE kolledata.kd_company 
SET 
  com_name='NAME OF THE COMPANY',
  com_email1='EMAILADDRESS 1',
  com_email2='EMAILADDRESS 2',
  com_phone1='TELEPHONENUMBER 1',
  com_phone2='TELEPHONENUMBER 2',
  com_country='COUNTRY',
  com_city='CITY',
  com_postcode='POSTCODE',
  com_adress='ADDRESS',
  com_url='URL',
  com_memo='MEMO', 
  com_timestamp= NOW()
WHERE  com_id= 1
-- Instead of 1, insert the ID of the company whose data you want to update
;

-- Person
UPDATE kolledata.kd_person 
SET
  per_name='NAME',
  per_firstname='FIRSTNAME', 
  per_url='URL',
  per_memo='MEMO',
  per_timestamp= NOW(), 
  per_company= 1 -- this number is referencing the ID of the Company this person is working in. e.g. 1
WHERE per_id=1
-- Instead of 1, insert the ID of the person whose data you want to update
;
  
-- Email
UPDATE kolledata.kd_email 
SET em_person_id=1, -- this number is referencing the ID of the person, whose emailaddress this is e.g. 1
    em_email='EMAILADDRESS',
    em_timestamp= NOW()
WHERE em_id = 1 -- Instead of 1, insert the ID of the emailaddress whose data you want to update
;

-- Phone
UPDATE kolledata.kd_phone 
SET
  ph_person_id=1, -- this number is referencing the ID of the person, whose phonenumber this is e.g. 1
  ph_phone='PHONENUMBER', 
  ph_timestamp= NOW()
WHERE ph_id = 1 -- Instead of 1, insert the ID of the phonenumber, whose data you want to update
;

-- (2) To make sure no one executes this with changes to the database
ROLLBACK;