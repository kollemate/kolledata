-- SOME DUMMY-DATA TO POPULATE THE DATABASE

-- Company
INSERT INTO kolledata.kd_company (com_name, com_email1, com_phone1, com_country, com_city, com_postcode, com_address, com_url, com_memo, com_timestamp)
VALUES ('Time and Relative Dimension in Space', 'vortex@tardis.org','0123/456789','mostly UK','mostly London or Cardiff','01187','our universe','http://www.bbc.co.uk/programmes/b006q2x0/profiles/tardis','The doctors Wife',NOW());

INSERT INTO kolledata.kd_company (com_name, com_email1, com_phone1, com_country, com_city, com_postcode, com_address, com_url, com_memo, com_timestamp)
VALUES ('The Church of the Silence', 'info@silence-must-fall.org','0345/2346189','in Space','No','12345','somewhere in the universe','http://tardis.wikia.com/wiki/Papal_Mainframe','currently in orbit over Trenzalor',NOW());

-- Company-History
INSERT INTO kolledata.kd_company_history (comh_company_id, comh_name, comh_email1, comh_phone1, comh_country, comh_city, comh_postcode, comh_address, comh_url, comh_memo, comh_timestamp)
VALUES (2,'The Church of the Papal Mainframe', 'info@mainframe.org','34534/4352341','in Space','No','45643','somewhere in the universe','http://tardis.wikia.com/wiki/Papal_Mainframe','',NOW() - INTERVAL 1 DAY);

-- Person
INSERT INTO kolledata.kd_person (per_name, per_firstname, per_url, per_memo, per_timestamp, per_company, per_email1)
VALUES ('Williams','Amy','http://www.bbc.co.uk/programmes/p00wqr12/profiles/amy-pond','Companion of the 11th doctor',NOW(),1, "amy@tardis.org");

INSERT INTO kolledata.kd_person (per_name, per_firstname, per_url, per_memo, per_timestamp, per_company, per_phone1)
VALUES ('Williams','Rory','http://www.bbc.co.uk/programmes/p00wqr12/profiles/rory-williams','The last centurion',NOW(),1,'0234/12342738');

INSERT INTO kolledata.kd_person (per_name, per_firstname, per_url, per_memo, per_timestamp, per_company)
VALUES ('Lem','Tasha','http://tardis.wikia.com/wiki/Tasha_Lem','the Mother Superious of the Papal Mainframe',NOW(),2);

INSERT INTO kolledata.kd_person (per_name, per_firstname, per_url, per_memo, per_timestamp, per_company)
VALUES ('','Strax','http://www.bbc.co.uk/programmes/b01rryyj/profiles/strax','The nurse',NOW(),1);

INSERT INTO kolledata.kd_person (per_name, per_firstname, per_url, per_memo, per_timestamp, per_company, per_email1, per_phone1, per_country, per_city, per_postcode, per_address)
VALUES ('Oswald','Clara','http://tardis.wikia.com/wiki/Clara_Oswald','Companion of all doctors',NOW(),1,"clara@tardis.org",'04523/23528945','England','London','238M234','Sample Road 5');

-- Person-History
INSERT INTO kolledata.kd_person_history (perh_person_id, perh_name, perh_firstname, perh_url, perh_memo, perh_timestamp, perh_company)
VALUES (2,'Williams','Rory','http://www.bbc.co.uk/programmes/p00wqr12/profiles/rory-williams','Companion of the 11th doctor',NOW() - INTERVAL 1 DAY,1);

INSERT INTO kolledata.kd_person_history (perh_person_id, perh_name, perh_firstname, perh_url, perh_memo, perh_timestamp, perh_company)
VALUES (1,'Pond','Amy','http://www.bbc.co.uk/programmes/p00wqr12/profiles/amy-pond','Companion of the 11th doctor',NOW() - INTERVAL 1 DAY,1);
