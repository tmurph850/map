CREATE TABLE application_table (
  application_id SERIAL UNIQUE,
  application_name varchar,
	application_environment integer,
	application_description varchar,
	primary_contact varchar,
	secondary_contact varchar,
	application_business varchar,
	application_sme varchar,
	application_dependencies text[],
	asset_list text[],
  time_stamp varchar,
  notes varchar
);

INSERT INTO application_table (
  application_name,
  application_environment, 
  application_description, 
  primary_contact,
  secondary_contact,
  application_business,
  application_sme
  )
VALUES
  ('MAP_Production_NewYork', 1, 'Customer Mapping System', 'Bob Smith', 'Joon Lee', 'Bob Smith', 'Joon Lee'),
  ('MAP_Production_London', 1, 'Customer Mapping System', 'Bob Smith', 'Joon Lee', 'Bob Smith', 'Joon Lee'),
  ('MAP_Development_NewYork', 2, 'Customer Mapping System', 'Bob Smith', 'Joon Lee', 'Bob Smith', 'Joon Lee'),
  ('EliteSync_Production_NewYork', 1, 'Synchronization between MAP and AppPro', 'Lisa Johns', 'Jason Watts', 'Lisa Johns', 'Lisa Johns'),
  ('ePay_Production_NewYork', 1, 'Electronic Payment System', 'Bob Smith', 'Joon Lee', 'Bob Smith', 'Joon Lee'),
  ('AppPro_Production_NewYork', 1, 'Customer Interface Application', 'Bob Smith', 'Joon Lee', 'Bob Smith', 'Joon Lee');
  
COPY application_table FROM 'C:\Users\tmurp\Programming\my-apps\curvature-map\documents\Application_Table.csv' DELIMITER ',' CSV HEADER;