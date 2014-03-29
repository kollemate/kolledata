-- No real scripts (!), just examples showing what you must do to add data to a specific table. The capitalized strings have to be replaced by real data from user input. You don't need to insert or update the history-tables manually.
-- Don't replace NOW()!

-- (1) To make sure no one executes this and inserts useless data
START TRANSACTION;

-- Company
INSERT INTO kolledata.kd_company (com_name, com_email, com_phone, com_country, com_city, com_postcode, com_adress, com_url, com_memo, com_timestamp)
VALUES (
  'NAME OF THE COMPANY',
  'EMAILADDRESS',
  'TELEPHONENUMBER',
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
  
-- Email
INSERT INTO kolledata.kd_email (em_person_id, em_email, em_timestamp)
VALUES (
  -- the following number is referencing the ID of the person, whose emailaddress this is e.g. 1
  1,
  'EMAILADDRESS',
  NOW()
);

-- Phone
INSERT INTO kolledata.kd_phone (ph_person_id, ph_phone, ph_timestamp)
VALUES (
  -- the following number is referencing the ID of the person, whose phonenumber this is e.g. 1
  1,
  'PHONENUMBER',
  NOW()
);

-- (2) To make sure no one executes this and inserts useless data
ROLLBACK;