-- Insert statement to add Tony Stark (Query 1)
INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ( 'Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- Modify statement to edit Tony Stark (Query 2)
UPDATE account 
SET account_type = 'Admin'
WHERE account_id = 1;

-- Delete Tony Stark from database (Query 3)
DELETE FROM account
WHERE account_id = 1;

-- Modify "GM Hummer" to read "a huge interior" (Query 4)
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'the small interiors', 'a huge interior')
WHERE inv_model = 'Hummer'

-- Inner join - select make/model, return "Sport" category items (Query 5)
SELECT 
  inv_make, 
  inv_model,
  classification_name
  FROM inventory
INNER JOIN classification 
  ON inventory.classification_id = classification.classification_id
WHERE inventory.classification_id = 2;  

-- Add /vehicles to all images, two separate columns (Query 6)
UPDATE inventory
SET inv_image = REPLACE (inv_image, '/images/', '/images/vehicles/'), 
	inv_thumbnail = REPLACE (inv_thumbnail, '/images/', '/images/vehicles/');