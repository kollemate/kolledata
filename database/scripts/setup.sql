-- CLEANUP
DROP DATABASE IF EXISTS kolledata;
SET SQL_SAFE_UPDATES=0;	

-- CREATING THE DATABASE
CREATE DATABASE kolledata;

-- CREATING THE TABLES
CREATE TABLE kolledata.kd_company (
  com_id INT NOT NULL AUTO_INCREMENT,
  com_name VARCHAR(200),
  com_email1 VARCHAR(100),
  com_email2 VARCHAR(100),
  com_phone1 VARCHAR(20),
  com_phone2 VARCHAR(20),
  com_country VARCHAR(100),
  com_city VARCHAR(100),
  com_postcode VARCHAR(10),
  com_adress VARCHAR(200),
  com_url VARCHAR(2083),
  com_memo TEXT,
  com_timestamp DATETIME,
  PRIMARY KEY (com_id)
);

-- Design question: perhabs Foreign key constrains usefull here?
CREATE TABLE kolledata.kd_company_history (
  comh_id INT NOT NULL AUTO_INCREMENT,
  comh_company_id INT,
  comh_name VARCHAR(200),
  comh_email1 VARCHAR(100),
  comh_email2 VARCHAR(100),
  comh_phone1 VARCHAR(20),
  comh_phone2 VARCHAR(20),
  comh_country VARCHAR(100),
  comh_city VARCHAR(100),
  comh_postcode VARCHAR(10),
  comh_adress VARCHAR(200),
  comh_url VARCHAR(2083),
  comh_memo TEXT,
  comh_timestamp DATETIME,
  PRIMARY KEY (comh_id)
  -- FOREIGN KEY (comh_company_id) REFERENCES kd_company(com_id)
  -- ON DELETE CASCADE -- ON UPDATE CASCADE
);

CREATE TABLE kolledata.kd_person (
  per_id INT NOT NULL AUTO_INCREMENT,
  per_name VARCHAR(200),
  per_firstname VARCHAR(200),
  per_url VARCHAR(2083),
  per_memo TEXT,
  per_timestamp DATETIME,
  per_company INT,
  PRIMARY KEY (per_id)
  -- FOREIGN KEY (per_company) REFERENCES kd_company(com_id)
  -- ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE kolledata.kd_person_history (
  perh_id INT NOT NULL AUTO_INCREMENT,
  perh_person_id INT,
  perh_name VARCHAR(200),
  perh_firstname VARCHAR(200),
  perh_url VARCHAR(2083),
  perh_memo TEXT,
  perh_timestamp DATETIME,
  perh_company INT,
  PRIMARY KEY (perh_id)
  -- FOREIGN KEY (perh_person_id) REFERENCES kd_person(per_id)
  -- ON DELETE CASCADE -- ON UPDATE CASCADE
);

CREATE TABLE kolledata.kd_email (
  em_id INT NOT NULL AUTO_INCREMENT,
  em_person_id INT,
  em_email VARCHAR(200),
  em_timestamp DATETIME,
  PRIMARY KEY (em_id)
  -- FOREIGN KEY (em_person_id) REFERENCES kd_person(per_id)
  -- ON DELETE CASCADE -- ON UPDATE CASCADE
);

CREATE TABLE kolledata.kd_email_history (
  emh_id INT NOT NULL AUTO_INCREMENT,
  emh_email_id INT,
  emh_email VARCHAR(200),
  emh_timestamp DATETIME,
  PRIMARY KEY (emh_id)
  -- FOREIGN KEY (emh_email_id) REFERENCES kd_email(em_id)
  -- ON DELETE CASCADE -- ON UPDATE CASCADE
);

CREATE TABLE kolledata.kd_phone (
  ph_id INT NOT NULL AUTO_INCREMENT,
  ph_person_id INT,
  ph_phone VARCHAR(20),
  ph_timestamp DATETIME,
  PRIMARY KEY (ph_id)
  -- FOREIGN KEY (ph_person_id) REFERENCES kd_person(per_id)
  -- ON DELETE CASCADE -- ON UPDATE CASCADE
);

CREATE TABLE kolledata.kd_phone_history (
  phh_id INT NOT NULL AUTO_INCREMENT,
  phh_phone_id INT,
  phh_phone VARCHAR(20),
  phh_timestamp DATETIME,
  PRIMARY KEY (phh_id)
  -- FOREIGN KEY (phh_phone_id) REFERENCES kd_phone(ph_id)
  -- ON DELETE CASCADE -- ON UPDATE CASCADE
);

-- CREATING THE TRIGGER
DELIMITER $$

CREATE
	TRIGGER kolledata.com_history_trigger AFTER UPDATE 
	ON kolledata.kd_company 
	FOR EACH ROW BEGIN
		
		-- update old references if present
		UPDATE kolledata.kd_company_history 
          SET comh_company_id= NEW.com_id
        WHERE comh_company_id=OLD.com_id;

		-- copy old stuff in history table
		INSERT INTO kolledata.kd_company_history (
			comh_company_id,
			comh_name,
			comh_email1,
      comh_email2,
			comh_phone1,
      comh_phone2,
			comh_country,
			comh_city,
			comh_postcode,
			comh_adress,
			comh_url,
			comh_memo,
			comh_timestamp
		) 
		VALUES (
			NEW.com_id, 
			OLD.com_name,
			OLD.com_email1,
      OLD.com_email2,
			OLD.com_phone1,
      OLD.com_phone2,
			OLD.com_country,
			OLD.com_city,
			OLD.com_postcode,
			OLD.com_adress,
			OLD.com_url,
			OLD.com_memo,
			OLD.com_timestamp
		);

END$$

CREATE
	TRIGGER kolledata.com_delete_trigger AFTER DELETE 
	ON kolledata.kd_company 
	FOR EACH ROW BEGIN

		-- copy old stuff in history table
		INSERT INTO kolledata.kd_company_history (
			comh_company_id,
			comh_name,
			comh_email1,
      comh_email2,
			comh_phone1,
      comh_phone2,
			comh_country,
			comh_city,
			comh_postcode,
			comh_adress,
			comh_url,
			comh_memo,
			comh_timestamp
		) 
		VALUES (
			OLD.com_id, 
			OLD.com_name,
			OLD.com_email1,
      OLD.com_email2,
			OLD.com_phone1,
      OLD.com_phone2,
			OLD.com_country,
			OLD.com_city,
			OLD.com_postcode,
			OLD.com_adress,
			OLD.com_url,
			OLD.com_memo,
			OLD.com_timestamp
		);

END$$

CREATE
	TRIGGER kolledata.per_history_trigger AFTER UPDATE 
	ON kolledata.kd_person 
	FOR EACH ROW BEGIN
		
		-- update old references if present
		UPDATE kolledata.kd_person_history 
          SET perh_person_id= NEW.per_id
        WHERE perh_person_id=OLD.per_id;

		-- copy old stuff in history table
		INSERT INTO kolledata.kd_person_history (
			perh_person_id,
      perh_name,
      perh_firstname,
      perh_url,
      perh_memo,
      perh_timestamp,
      perh_company
		) 
		VALUES (
			NEW.per_id, 
			OLD.per_name,
      OLD.per_firstname,
      OLD.per_url,
      OLD.per_memo,
      OLD.per_timestamp,
      OLD.per_company
		);

END$$

CREATE
	TRIGGER kolledata.per_delete_trigger AFTER DELETE 
	ON kolledata.kd_person 
	FOR EACH ROW BEGIN
		-- copy old stuff in history table
		INSERT INTO kolledata.kd_person_history (
			perh_person_id,
      perh_name,
      perh_firstname,
      perh_url,
      perh_memo,
      perh_timestamp,
      perh_company
		) 
		VALUES (
			OLD.per_id, 
			OLD.per_name,
      OLD.per_firstname,
      OLD.per_url,
      OLD.per_memo,
      OLD.per_timestamp,
      OLD.per_company
		);

END$$

CREATE
	TRIGGER kolledata.em_history_trigger AFTER UPDATE 
	ON kolledata.kd_email 
	FOR EACH ROW BEGIN
		
		-- update old references if present
		UPDATE kolledata.kd_email_history 
          SET emh_email_id= NEW.em_id
        WHERE emh_email_id=OLD.em_id;

		-- copy old stuff in history table
		INSERT INTO kolledata.kd_email_history (
			emh_email_id,
      emh_email,
      emh_timestamp
		) 
		VALUES (
			NEW.em_id, 
			OLD.em_email,
      OLD.em_timestamp
		);

END$$

CREATE
	TRIGGER kolledata.em_delete_trigger AFTER DELETE 
	ON kolledata.kd_email 
	FOR EACH ROW BEGIN
		-- copy old stuff in history table
		INSERT INTO kolledata.kd_email_history (
			emh_email_id,
      emh_email,
      emh_timestamp
		) 
		VALUES (
			OLD.em_id, 
			OLD.em_email,
      OLD.em_timestamp
		);

END$$

CREATE
	TRIGGER kolledata.ph_history_trigger AFTER UPDATE 
	ON kolledata.kd_phone 
	FOR EACH ROW BEGIN
		
		-- update old references if present
		UPDATE kolledata.kd_phone_history 
          SET phh_phone_id= NEW.ph_id
        WHERE phh_phone_id=OLD.ph_id;

		-- copy old stuff in history table
		INSERT INTO kolledata.kd_phone_history (
			phh_phone_id,
      phh_phone,
      phh_timestamp
		) 
		VALUES (
			NEW.ph_id, 
			OLD.ph_phone,
      OLD.ph_timestamp
		);

END$$

CREATE
	TRIGGER kolledata.ph_delete_trigger AFTER DELETE 
	ON kolledata.kd_phone 
	FOR EACH ROW BEGIN

		-- copy old stuff in history table
		INSERT INTO kolledata.kd_phone_history (
			phh_phone_id,
      phh_phone,
      phh_timestamp
		) 
		VALUES (
			OLD.ph_id, 
			OLD.ph_phone,
      OLD.ph_timestamp
		);

END$$

DELIMITER ;
