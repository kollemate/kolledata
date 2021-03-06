﻿-- No real scripts (!), just examples showing what you must do to add data to a specific table. The capitalized strings have to be replaced by real data from user input. You don't need to insert, update or delete the history-tables manually.
-- Don't replace NOW()!

-- (1) To make sure no one executes this and inserts useless data
START TRANSACTION;

-- Company
INSERT INTO kolledata.kd_company (com_name, com_email1, com_email2, com_phone1, com_phone2, com_country, com_city, com_postcode, com_address, com_url, com_memo, com_timestamp)
VALUES (
  'NAME OF THE COMPANY',
  'EMAILADDRESS 1',
  'EMAILADDRESS 2',
  'TELEPHONENUMBER 1',
  'TELEPHONENUMBER 2',
  'COUNTRY',
  'CITY',
  'POSTCODE',
  'ADDRESS',
  'URL',
  'MEMO',
   NOW()
);

-- Person
INSERT INTO kolledata.kd_person (per_name, per_firstname, per_url, per_memo, per_timestamp, per_company)   
VALUES (
  'NAME',
  'FIRSTNAME',
  'URL',
  'MEMO',
   NOW(),
  -- the following number is referencing the ID of the Company this person is working in. e.g. 1
  1
);
  
-- (2) To make sure no one executes this and inserts useless data
ROLLBACK;