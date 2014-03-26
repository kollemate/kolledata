-- CREATING THE DATABASE
CREATE DATABASE kolledata;

-- CREATING THE TABLES
CREATE TABLE kolledata.kd_company (
  com_id INT NOT NULL AUTO_INCREMENT,
  com_name VARCHAR(200),
  com_email VARCHAR(100),
  com_phone VARCHAR(20),
  com_country VARCHAR(100),
  com_city VARCHAR(100),
  com_postcode VARCHAR(10),
  com_adress VARCHAR(200),
  com_url VARCHAR(300),
  com_memo TEXT,
  com_timestamp DATETIME,
  PRIMARY KEY (com_id)
);

-- Design question: perhabs Foreign key constrains usefull here?
CREATE TABLE kolledata.kd_company_history (
  comh_id INT NOT NULL AUTO_INCREMENT,
  comh_company_id INT,
  comh_name VARCHAR(200),
  comh_email VARCHAR(100),
  comh_phone VARCHAR(20),
  comh_country VARCHAR(100),
  comh_city VARCHAR(100),
  comh_postcode VARCHAR(10),
  comh_adress VARCHAR(200),
  comh_url VARCHAR(300),
  comh_memo TEXT,
  comh_timestamp DATETIME,
  -- FOREIGN KEY (comh_company_id) REFERENCES kd_company(com_id)
  -- ON DELETE CASCADE ON UPDATE CASCADE
  PRIMARY KEY (comh_id)
);

CREATE TABLE kolledata.kd_person (
  per_id INT NOT NULL AUTO_INCREMENT,
  per_name VARCHAR(200),
  per_firstname VARCHAR(200),
  per_email_1 VARCHAR(100),
  per_email_2 VARCHAR(100),
  per_phone_1 VARCHAR(20),
  per_phone_2 VARCHAR(20),
  per_url VARCHAR(300),
  per_memo TEXT,
  per_timestamp DATETIME,
  per_company INT,
  -- FOREIGN KEY (per_company) REFERENCES kd_company(com_id)
  -- ON DELETE CASCADE ON UPDATE CASCADE
  PRIMARY KEY (per_id)
);

CREATE TABLE kolledata.kd_person_history (
  perh_id INT NOT NULL AUTO_INCREMENT,
  perh_person_id INT,
  perh_name VARCHAR(200),
  perh_firstname VARCHAR(200),
  perh_email_1 VARCHAR(100),
  perh_email_2 VARCHAR(100),
  perh_phone_1 VARCHAR(20),
  perh_phone_2 VARCHAR(20),
  perh_url VARCHAR(300),
  perh_memo TEXT,
  perh_timestamp DATETIME,
  perh_company INT,
  -- FOREIGN KEY (perh_person_id) REFERENCES kd_person(per_id)
  -- ON DELETE CASCADE ON UPDATE CASCADE
  PRIMARY KEY (perh_id)
);
