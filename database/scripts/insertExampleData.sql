-- SOME DUMMY-DATA TO POPULATE THE DATABASE

-- Company
INSERT INTO kolledata.kd_company (com_name, com_email1, com_phone1, com_country, com_city, com_postcode, com_adress, com_url, com_memo, com_timestamp)
VALUES ('Time and Relative Dimension in Space', 'vortex@tardis.org','yes','mostly UK','mostly London or Cardiff','???','our universe','http://www.bbc.co.uk/programmes/b006q2x0/profiles/tardis','The doctors Wife',NOW());

INSERT INTO kolledata.kd_company (com_name, com_email1, com_phone1, com_country, com_city, com_postcode, com_adress, com_url, com_memo, com_timestamp)
VALUES ('The Church of the Silence', 'info@silence-must-fall.org','0000...','in Space','No','???','somewhere in the universe','http://tardis.wikia.com/wiki/Papal_Mainframe','currently in orbit over Trenzalor',NOW());

-- Company-History
INSERT INTO kolledata.kd_company_history (comh_company_id, comh_name, comh_email1, comh_phone1, comh_country, comh_city, comh_postcode, comh_adress, comh_url, comh_memo, comh_timestamp)
VALUES (2,'The Church of the Papal Mainframe', 'info@mainframe.org','0000...','in Space','No','???','somewhere in the universe','http://tardis.wikia.com/wiki/Papal_Mainframe','',NOW() - INTERVAL 1 DAY);

-- Person
INSERT INTO kolledata.kd_person (per_name, per_firstname, per_url, per_memo, per_timestamp, per_company)   
VALUES ('Williams','Amy','http://www.bbc.co.uk/programmes/p00wqr12/profiles/amy-pond','Companion of the 11th doctor',NOW(),1);	

INSERT INTO kolledata.kd_person (per_name, per_firstname, per_url, per_memo, per_timestamp, per_company)   
VALUES ('Williams','Rory','http://www.bbc.co.uk/programmes/p00wqr12/profiles/rory-williams','The last centurion',NOW(),1);

INSERT INTO kolledata.kd_person (per_name, per_firstname, per_url, per_memo, per_timestamp, per_company)   
VALUES ('Lem','Tasha','http://tardis.wikia.com/wiki/Tasha_Lem','the Mother Superious of the Papal Mainframe',NOW(),2);

INSERT INTO kolledata.kd_person (per_name, per_firstname, per_url, per_memo, per_timestamp, per_company)   
VALUES ('-','Strax','http://www.bbc.co.uk/programmes/b01rryyj/profiles/strax','The nurse',NOW(),1);

INSERT INTO kolledata.kd_person (per_name, per_firstname, per_url, per_memo, per_timestamp, per_company)   
VALUES ('Oswald','Clara','http://tardis.wikia.com/wiki/Clara_Oswald','Companion of all doctors',NOW(),1);

-- Person-History
INSERT INTO kolledata.kd_person_history (perh_person_id, perh_name, perh_firstname, perh_url, perh_memo, perh_timestamp, perh_company)   
VALUES (2,'Williams','Rory','http://www.bbc.co.uk/programmes/p00wqr12/profiles/rory-williams','Companion of the 11th doctor',NOW() - INTERVAL 1 DAY,1);

INSERT INTO kolledata.kd_person_history (perh_person_id, perh_name, perh_firstname, perh_url, perh_memo, perh_timestamp, perh_company)   
VALUES (1,'Pond','Amy','http://www.bbc.co.uk/programmes/p00wqr12/profiles/amy-pond','Companion of the 11th doctor',NOW() - INTERVAL 1 DAY,1);

-- Email
INSERT INTO kolledata.kd_email (em_person_id, em_email, em_timestamp)
VALUES (1,'amy@pond.co.uk',NOW());

INSERT INTO kolledata.kd_email (em_person_id, em_email, em_timestamp)
VALUES (1,'amy@tardis.org',NOW());

INSERT INTO kolledata.kd_email (em_person_id, em_email, em_timestamp)
VALUES (2,'rory@tardis.org',NOW());

INSERT INTO kolledata.kd_email (em_person_id, em_email, em_timestamp)
VALUES (3,'MotherSuperious@mainframe.org',NOW());

INSERT INTO kolledata.kd_email (em_person_id, em_email, em_timestamp)
VALUES (4,'strax@sontaran-empire.com',NOW());

INSERT INTO kolledata.kd_email (em_person_id, em_email, em_timestamp)
VALUES (4,'strax@declare-war-on-the-moon.com',NOW());

INSERT INTO kolledata.kd_email (em_person_id, em_email, em_timestamp)
VALUES (5,'clara@tardis.org',NOW());

-- Email-History
INSERT INTO kolledata.kd_email_history (emh_email_id, emh_email, emh_timestamp)
VALUES (1,'Raggedy_Man_is_real@pond.co.uk',NOW() - INTERVAL 1 DAY);

-- Phone
INSERT INTO kolledata.kd_phone (ph_person_id, ph_phone, ph_timestamp)
VALUES (1,'01111...',NOW());

INSERT INTO kolledata.kd_phone (ph_person_id, ph_phone, ph_timestamp)
VALUES (1,'01234...',NOW());

INSERT INTO kolledata.kd_phone (ph_person_id, ph_phone, ph_timestamp)
VALUES (2,'05111234...',NOW());

INSERT INTO kolledata.kd_phone (ph_person_id, ph_phone, ph_timestamp)
VALUES (3,'00001...',NOW());

INSERT INTO kolledata.kd_phone (ph_person_id, ph_phone, ph_timestamp)
VALUES (4,'09999...',NOW());

INSERT INTO kolledata.kd_phone (ph_person_id, ph_phone, ph_timestamp)
VALUES (5,'09876...',NOW());

-- Phone-History
INSERT INTO kolledata.kd_phone_history (phh_phone_id, phh_phone, phh_timestamp)
VALUES (1,'0444444...old',NOW() - INTERVAL 1 DAY);