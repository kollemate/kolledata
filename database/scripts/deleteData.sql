-- No real scripts (!), just examples showing what you must do to delete data-rows in a specific table. You don't need to insert, update or delete the history-tables manually. If you delete a person, its emailaddresses and phonenumbers will be deleted by the database.

-- (1) To make sure no one executes this with changes to the database
START TRANSACTION;

-- Company  (by ID)
DELETE FROM kolledata.kd_company 
WHERE  com_id= 1 -- Instead of 1, insert the ID of the company whose data you want to delete
;

-- Company  (by name)
DELETE FROM kolledata.kd_company 
WHERE  com_name= 'U.N.I.T' -- Just an example. Be carefull with those, if there are multiple entrys with this name all of them will be deleted
;

-- Person (by ID)
DELETE FROM kolledata.kd_person 
WHERE per_id=1 -- Instead of 1, insert the ID of the person whose data you want to delete
;

-- Person (by name)
DELETE FROM kolledata.kd_person 
WHERE per_name='STEWART' AND per_firstname='PATRICK' -- Just an example. Be carefull with those, if there are multiple entrys with this name all of them will be deleted
;
  
-- Email (by ID)
DELETE kolledata.kd_email 
WHERE em_id = 1 -- Instead of 1, insert the ID of the emailaddress whose data you want to delete
;

-- Email (by emailaddress)
DELETE kolledata.kd_email 
WHERE em_email = "a@b.com" -- Just an example. Be carefull with those, if there are multiple entrys with this address all of them will be deleted
;

-- Phone (by ID)
DELETE kolledata.kd_phone 
WHERE ph_id = 1 -- Instead of 1, insert the ID of the phonenumber, whose data you want to delete
;

-- Phone (by phonenumber)
DELETE kolledata.kd_phone 
WHERE ph_phone = '111111' -- Just an example. Be carefull with those, if there are multiple entrys with this phonenumber all of them will be deleted
;

-- (2) To make sure no one executes this with changes to the database
ROLLBACK;