-- SOME DUMMY-DATA TO POPULATE THE DATABASE

-- Company
INSERT INTO kolledata.kd_company (com_name, com_email, com_phone, com_country, com_city, com_postcode, com_adress, com_url, com_memo, com_timestamp)
VALUES ('Time and Relative Dimension in Space', 'vortex@tardis.org','yes','mostly UK','mostly London or Cardiff','???','our universe','http://www.bbc.co.uk/programmes/b006q2x0/profiles/tardis','The doctors Wife',NOW());

INSERT INTO kolledata.kd_company (com_name, com_email, com_phone, com_country, com_city, com_postcode, com_adress, com_url, com_memo, com_timestamp)
VALUES ('The Church of the Silence', 'info@silence-must-fall.org','0000...','in Space','No','???','somewhere in the universe','http://tardis.wikia.com/wiki/Papal_Mainframe','currently in orbit over Trenzalor',NOW());

-- Company-History
INSERT INTO kolledata.kd_company_history (comh_company_id, comh_name, comh_email, comh_phone, comh_country, comh_city, comh_postcode, comh_adress, comh_url, comh_memo, comh_timestamp)
VALUES (2,'The Church of the Papal Mainframe', 'info@mainframe.org','0000...','in Space','No','???','somewhere in the universe','http://tardis.wikia.com/wiki/Papal_Mainframe','',NOW());

-- Person
INSERT INTO kolledata.kd_person (per_name, per_firstname, per_email_1, per_email_2, per_phone_1, per_phone_2, per_url, per_memo, per_timestamp, per_company)   
VALUES ('Williams','Amy','amy@pond.co.uk','amy@tardis.org','01111...','0123...','http://www.bbc.co.uk/programmes/p00wqr12/profiles/amy-pond','Companion of the 11th doctor',NOW(),1);	

INSERT INTO kolledata.kd_person (per_name, per_firstname, per_email_1, per_email_2, per_phone_1, per_phone_2, per_url, per_memo, per_timestamp, per_company)   
VALUES ('Williams','Rory','rory@pond.co.uk','rory@tardis.org','01211...','0143...','http://www.bbc.co.uk/programmes/p00wqr12/profiles/rory-williams','The last centurion',NOW(),1);

INSERT INTO kolledata.kd_person (per_name, per_firstname, per_email_1, per_email_2, per_phone_1, per_phone_2, per_url, per_memo, per_timestamp, per_company)   
VALUES ('Lem','Tasha','MotherSuperious@mainframe.org','tasha.Lem@tardis.org','00001...','00100...','http://tardis.wikia.com/wiki/Tasha_Lem','the Mother Superious of the Papal Mainframe',NOW(),2);

INSERT INTO kolledata.kd_person (per_name, per_firstname, per_email_1, per_email_2, per_phone_1, per_phone_2, per_url, per_memo, per_timestamp, per_company)   
VALUES ('-','Strax','strax@sontaran-empire.com','strax@declare-war-on-the-moon.com','0999...','08888...','http://www.bbc.co.uk/programmes/b01rryyj/profiles/strax','The nurse',NOW(),1);

INSERT INTO kolledata.kd_person (per_name, per_firstname, per_email_1, per_email_2, per_phone_1, per_phone_2, per_url, per_memo, per_timestamp, per_company)   
VALUES ('Oswald','Clara','clara@tardis.org','clara@oswald.com','0982...','04898...','http://tardis.wikia.com/wiki/Clara_Oswald','Companion of all doctors',NOW(),1);

-- Person-History
INSERT INTO kolledata.kd_person_history (perh_person_id, perh_name, perh_firstname, perh_email_1, perh_email_2, perh_phone_1, perh_phone_2, perh_url, perh_memo, perh_timestamp, perh_company)   
VALUES (2,'Williams','Rory','rory@pond.co.uk','rory@tardis.org','01211...','0143...','http://www.bbc.co.uk/programmes/p00wqr12/profiles/rory-williams','Companion of the 11th doctor',NOW(),1);

INSERT INTO kolledata.kd_person_history (perh_person_id, perh_name, perh_firstname, perh_email_1, perh_email_2, perh_phone_1, perh_phone_2, perh_url, perh_memo, perh_timestamp, perh_company)   
VALUES (1,'Pond','Amy','amy@pond.co.uk','amy@tardis.org','01111...','0123...','http://www.bbc.co.uk/programmes/p00wqr12/profiles/amy-pond','Companion of the 11th doctor',NOW(),1);