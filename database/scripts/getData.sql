-- No real scripts (!), just examples showing what you must do to get specific data.

-- Some simple Select-Statements (not all)
-- Get all Company-Data (rather don't display the com_id to the user)
SELECT *
FROM kolledata.kd_company;

-- Get all Company-Data from a specific entry
SELECT *
FROM kolledata.kd_company
WHERE  com_id= 1 -- Instead of 1, insert the ID of the company whose data you want to select
;

-- Get all data that belongs to a specific person
SELECT *
FROM kolledata.kd_person
WHERE per_id =1 -- Instead of 1, insert the ID of the person whose data you want to select
;

-- Get all the Emailaddresses of a (given) person
SELECT em_email
FROM kolledata.kd_email
WHERE em_person_id =1 -- Instead of 1, insert the ID of the person whose emailaddresses you want to select
;

-- Get all the Phonenumbers of a (given) person
SELECT ph_phone
FROM kolledata.kd_phone
WHERE ph_person_id =1 -- Instead of 1, insert the ID of the person whose phonenumbers you want to select
;

-- Get all the Employees of a company
SELECT *
FROM kolledata.kd_person
WHERE per_company = 1 -- Instead of 1, insert the ID of the company whose employees you want to select
;

-- Get the name of the Company of a person
SELECT com_name
FROM kolledata.kd_person, kolledata.kd_company
WHERE per_id = 1 -- Instead of 1, insert the ID of the person whose data you want to select
  AND per_company = com_id
;

-- Get the most current timestamp that a specific person, their email or their phone was changed (e.g. to be displayed to the user)
SELECT
    CASE
        WHEN Helper.P>=Helper.E and Helper.P>=Helper.PH THEN
        Helper.P
        WHEN Helper.E>=Helper.P and Helper.E>=Helper.PH THEN
        Helper.E
        WHEN Helper.PH>=Helper.P and Helper.PH>=Helper.E THEN
        Helper.E
    END as most_current_modified_date
FROM (
    SELECT distinct per_timestamp AS P, em_timestamp AS E, ph_timestamp AS PH FROM kolledata.kd_person, kolledata.kd_email, kolledata.kd_phone
    WHERE per_id=1 -- Instead of 1, insert the ID of the person whose data you want to select
    and em_person_id=per_id and ph_person_id=per_id) AS helper
;

-- Get the history of a (given) persons entry
SELECT *
FROM kolledata.kd_person_history
WHERE perh_person_id = 1 -- Instead of 1, insert the ID of the person whose historic data you want to select
;

-- Get the history of a (given) companys entry
SELECT *
FROM kolledata.kd_company_history
WHERE comh_company_id = 1 -- Instead of 1, insert the ID of the company whose historic data you want to select
;

-- Get the history of an (given) persons email entry
SELECT emh_id, emh_email_id, emh_email, emh_timestamp
FROM kolledata.kd_email_history, kolledata.kd_email
WHERE em_person_id = 1 -- Instead of 1, insert the ID of the person whose historic data you want to select
  and em_id = emh_email_id
;

-- Get the history of an (given) persons phone entry
SELECT phh_id, phh_phone_id, phh_phone, phh_timestamp
FROM kolledata.kd_phone_history, kolledata.kd_phone
WHERE ph_phone_id = 1 -- Instead of 1, insert the ID of the person whose historic data you want to select
  and ph_id = phh_phone_id
;
