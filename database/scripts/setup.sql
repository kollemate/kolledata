-- CLEANUP
DROP DATABASE IF EXISTS kolledata;
SET SQL_SAFE_UPDATES=0;	

-- CREATING THE DATABASE
CREATE DATABASE kolledata;

-- CREATING THE TABLES
CREATE TABLE kolledata.kd_account (
  acc_id INT NOT NULL AUTO_INCREMENT,
  acc_username VARCHAR(50) NOT NULL UNIQUE,
  acc_password VARCHAR(128) NOT NULL,
  acc_salt VARCHAR(64) NOT NULL,
  PRIMARY KEY (acc_id)
);

CREATE TABLE kolledata.kd_company (
  com_id INT NOT NULL AUTO_INCREMENT,
  com_name VARCHAR(200),
  com_email1 VARCHAR(100),
  com_email2 VARCHAR(100),
  com_phone1 VARCHAR(20),
  com_phone2 VARCHAR(20),
  com_fax VARCHAR(20),
  com_country VARCHAR(100),
  com_city VARCHAR(100),
  com_postcode VARCHAR(10),
  com_address VARCHAR(200),
  com_url VARCHAR(2083),
  com_memo LONGTEXT,
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
  comh_fax VARCHAR(20),
  comh_country VARCHAR(100),
  comh_city VARCHAR(100),
  comh_postcode VARCHAR(10),
  comh_address VARCHAR(200),
  comh_url VARCHAR(2083),
  comh_memo LONGTEXT,
  comh_timestamp DATETIME,
  PRIMARY KEY (comh_id)
  -- FOREIGN KEY (comh_company_id) REFERENCES kd_company(com_id)
  -- ON DELETE CASCADE -- ON UPDATE CASCADE
);

CREATE TABLE kolledata.kd_person (
  per_id INT NOT NULL AUTO_INCREMENT,
  per_salutation VARCHAR(50),
  per_academic_title VARCHAR(50),
  per_name VARCHAR(200),
  per_firstname VARCHAR(200),
  per_fax VARCHAR(50),
  per_email1 VARCHAR(200),
  per_email2 VARCHAR(200),
  per_phone1 VARCHAR(20),
  per_phone2 VARCHAR(20),
  per_url VARCHAR(2083),
  per_country VARCHAR(100),
  per_city VARCHAR(100),
  per_postcode VARCHAR(10),
  per_address VARCHAR(200),
  per_memo LONGTEXT,
  per_timestamp DATETIME,
  per_company INT,
  per_department VARCHAR(100),
  per_referredBy INT,
  per_category INT,
  PRIMARY KEY (per_id)
  -- FOREIGN KEY (per_company) REFERENCES kd_company(com_id)
  -- ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE kolledata.kd_person_history (
  perh_id INT NOT NULL AUTO_INCREMENT,
  perh_person_id INT,
  perh_salutation VARCHAR(50),
  perh_academic_title VARCHAR(50),
  perh_name VARCHAR(200),
  perh_firstname VARCHAR(200),
  perh_fax VARCHAR(50),
  perh_email1 VARCHAR(200),
  perh_email2 VARCHAR(200),
  perh_phone1 VARCHAR(20),
  perh_phone2 VARCHAR(20),
  perh_url VARCHAR(2083),
  perh_country VARCHAR(100),
  perh_city VARCHAR(100),
  perh_postcode VARCHAR(10),
  perh_address VARCHAR(200),
  perh_memo LONGTEXT,
  perh_timestamp DATETIME,
  perh_company INT,
  perh_department VARCHAR(100),
  perh_referredBy INT,
  perh_category INT,
  PRIMARY KEY (perh_id)
  -- FOREIGN KEY (perh_person_id) REFERENCES kd_person(per_id)
  -- ON DELETE CASCADE -- ON UPDATE CASCADE
);

CREATE TABLE kolledata.kd_bank_accounts (
  ba_id INT NOT NULL AUTO_INCREMENT,
  ba_owner_id INT,
  ba_type_owner VARCHAR(1),
  ba_account_number VARCHAR(20),
  ba_bank_code VARCHAR(10),
  ba_IBAN VARCHAR(30),
  ba_BIC VARCHAR(11),
  ba_bank_name VARCHAR(50),
  ba_tax_number VARCHAR(20),
  ba_sales_tax_ident_number VARCHAR(20),
  ba_timestamp DATETIME,
  PRIMARY KEY (ba_id)
);

CREATE TABLE kolledata.kd_bank_accounts_history (
  bah_id INT NOT NULL AUTO_INCREMENT,
  bah_bank_account_id INT,
  bah_owner_id INT,
  bah_type_owner VARCHAR(1),
  bah_account_number VARCHAR(20),
  bah_bank_code VARCHAR(10),
  bah_IBAN VARCHAR(30),
  bah_BIC VARCHAR(11),
  bah_bank_name VARCHAR(50),
  bah_tax_number VARCHAR(20),
  bah_sales_tax_ident_number VARCHAR(20),
  bah_timestamp DATETIME,
  PRIMARY KEY (bah_id)
);

CREATE TABLE kolledata.kd_category (
  cat_id INT NOT NULL AUTO_INCREMENT,
  cat_name VARCHAR(50),
  cat_memo TEXT,
  PRIMARY KEY (cat_id)

);

CREATE TABLE kolledata.kd_kd_category_history (
  cath_id INT NOT NULL AUTO_INCREMENT,
  cath_category_id INT,
  cath_name VARCHAR(50),
  cath_memo TEXT,
  PRIMARY KEY (cath_id)

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
      comh_fax,
			comh_country,
			comh_city,
			comh_postcode,
			comh_address,
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
      OLD.com_fax,
			OLD.com_country,
			OLD.com_city,
			OLD.com_postcode,
			OLD.com_address,
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
      comh_fax,
			comh_country,
			comh_city,
			comh_postcode,
			comh_address,
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
      OLD.com_fax,
			OLD.com_country,
			OLD.com_city,
			OLD.com_postcode,
			OLD.com_address,
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
      perh_salutation,
      perh_academic_title,
      perh_name,
      perh_firstname,
      perh_fax,
      perh_email1,
	  perh_email2,
	  perh_phone1,
	  perh_phone2,
	  perh_url,
	  perh_country,
	  perh_city,
      perh_postcode,
      perh_address,
      perh_memo,
      perh_timestamp,
      perh_company,
      perh_department,
      perh_referredBy,
      perh_category
		) 
		VALUES (
			NEW.per_id,
      OLD.per_salutation,
      OLD.per_academic_title,
			OLD.per_name,
      OLD.per_firstname,
      OLD.per_fax,
	  OLD.per_email1,
	  OLD.per_email2,
	  OLD.per_phone1,
	  OLD.per_phone2,
      OLD.per_url,
	  OLD.per_country,
	  OLD.per_city,
      OLD.per_postcode,
      OLD.per_address,
      OLD.per_memo,
      OLD.per_timestamp,
      OLD.per_company,
      OLD.per_department,
      OLD.per_referredBy,
      OLD.per_category
		);

END$$

CREATE
	TRIGGER kolledata.per_delete_trigger AFTER DELETE 
	ON kolledata.kd_person 
	FOR EACH ROW BEGIN
		-- copy old stuff in history table
		INSERT INTO kolledata.kd_person_history (
			perh_person_id,
      perh_salutation,
      perh_academic_title,
      perh_name,
      perh_firstname,
      perh_fax,
	  perh_email1,
	  perh_email2,
	  perh_phone1,
	  perh_phone2,
      perh_url,
	  perh_country,
	  perh_city,
      perh_postcode,
      perh_address,
      perh_memo,
      perh_timestamp,
      perh_company,
      perh_department,
      perh_referredBy,
      perh_category
		) 
		VALUES (
			OLD.per_id, 
			OLD.per_salutation,
      OLD.per_academic_title,
			OLD.per_name,
      OLD.per_firstname,
      OLD.per_fax,
	  OLD.per_email1,
	  OLD.per_email2,
	  OLD.per_phone1,
	  OLD.per_phone2,
      OLD.per_url,
	  OLD.per_country,
	  OLD.per_city,
      OLD.per_postcode,
      OLD.per_address,
      OLD.per_memo,
      OLD.per_timestamp,
      OLD.per_company,
      OLD.per_department,
      OLD.per_referredBy,
      OLD.per_category
		);

END$$

CREATE
	TRIGGER kolledata.bank_accounts_history_trigger AFTER UPDATE 
	ON kolledata.kd_bank_accounts 
	FOR EACH ROW BEGIN
		
		-- update old references if present
		UPDATE kolledata.kd_bank_accounts_history 
          SET bah_bank_account_id= NEW.ba_id
        WHERE bah_bank_account_id=OLD.ba_id;

		-- copy old stuff in history table
		INSERT INTO kolledata.kd_bank_accounts_history (
			bah_id,
      bah_bank_account_id,
      bah_owner_id,
      bah_type_owner,
      bah_account_number,
      bah_bank_code,
      bah_IBAN,
      bah_BIC,
      bah_bank_name,
      bah_tax_number,
      bah_sales_tax_ident_number,
      bah_timestamp
		) 
		VALUES (
			NEW.ba_id, 
			OLD.ba_owner_id,
      OLD.ba_type_owner,
      OLD.ba_account_number,
      OLD.ba_bank_code,
      OLD.ba_IBAN,
      OLD.ba_BIC,
      OLD.ba_bank_name,
      OLD.ba_tax_number,
      OLD.ba_sales_tax_ident_number,
      OLD.ba_timestamp
		);

END$$

CREATE
	TRIGGER kolledata.bank_accounts_delete_trigger AFTER DELETE 
	ON kolledata.kd_bank_accounts 
	FOR EACH ROW BEGIN
		
		-- copy old stuff in history table
		INSERT INTO kolledata.kd_bank_accounts_history (
			bah_id,
      bah_bank_account_id,
      bah_owner_id,
      bah_type_owner,
      bah_account_number,
      bah_bank_code,
      bah_IBAN,
      bah_BIC,
      bah_bank_name,
      bah_tax_number,
      bah_sales_tax_ident_number,
      bah_timestamp
		) 
		VALUES (
			OLD.ba_id, 
			OLD.ba_owner_id,
      OLD.ba_type_owner,
      OLD.ba_account_number,
      OLD.ba_bank_code,
      OLD.ba_IBAN,
      OLD.ba_BIC,
      OLD.ba_bank_name,
      OLD.ba_tax_number,
      OLD.ba_sales_tax_ident_number,
      OLD.ba_timestamp
		);

END$$

CREATE
	TRIGGER kolledata.cat_history_trigger AFTER UPDATE 
	ON kolledata.kd_category 
	FOR EACH ROW BEGIN
		
		-- update old references if present
		UPDATE kolledata.kd_category_history 
          SET cath_category_id= NEW.cat_id
        WHERE cath_category_id=OLD.cat_id;

		-- copy old stuff in history table
		INSERT INTO kolledata.kd_category_history (
			cath_category_id,
      cath_name,
      cath_memo
		) 
		VALUES (
			NEW.cat_id, 
			OLD.cat_name,
      OLD.cat_memo
		);

END$$

CREATE
	TRIGGER kolledata.cath_delete_trigger AFTER DELETE 
	ON kolledata.kd_category 
	FOR EACH ROW BEGIN

		-- copy old stuff in history table
		INSERT INTO kolledata.kd_category_history (
			cath_category_id,
      cath_name,
      cath_memo
		) 
		VALUES (
			OLD.cat_id, 
			OLD.cat_name,
      OLD.cat_memo
		);

END$$

DELIMITER ;
