/***********************************
*            ASSET_TABLE           *
************************************/


CREATE TABLE asset_table (
  asset_id SERIAL UNIQUE,
  asset_name varchar,
  asset_type integer,
  asset_make varchar,
  asset_model varchar,
  asset_environment integer,
  asset_function varchar,
  physical_or_virtual varchar,
  applications text[],
  serial_number integer,
  data_center varchar,
  move_group varchar,
  os varchar,
  cpu integer,
  ram integer,
  disk_size integer,
  disk_provisioned varchar,
  ip_address varchar,
  all_ips text[],
  subnet varchar,
  gateway varchar,
  vlan varchar,
  domain_name varchar,
  db_dependency varchar,
  db_asset_dependencies text[],
  network_dependencies text[],
  fileshare_dependencies text[],
  clustered boolean,
  cluster_nodes text[],
  load_balanced boolean,
  vip_requirements varchar,
  firewall text[],
  dmz boolean,
  storage_dependencies text[],
  server_dependencies text[],
  notes varchar,
  is_chassis boolean,
  is_blade boolean,
  time_stamp varchar
);

COPY asset_table FROM 'C:\Users\tmurp\Programming\databases\Asset_Table.csv'
DELIMITER ','
CSV HEADER;


/***********************************
*            ASSET_TABLE           *
************************************/


/***********************************
*          ASSET_TYPES_TABLE       *
************************************/


CREATE TABLE asset_types_table (
  asset_type_id integer,
  asset_type_name varchar
);

INSERT INTO asset_types_table (asset_type_id, asset_type_name)
VALUES
  (1, 'server'),
  (2, 'appliance'),
  (3, 'storage_array'),
  (4, 'switch'),
  (5, 'vm'),
  (6, 'esx_host'),
  (7, 'chassis'),
  (8, 'blade_server');


/***********************************
*          ASSET_TYPES_TABLE       *
************************************/


/***********************************
*          ASSET_ENVS_TABLE        *
************************************/

CREATE TABLE environments_table (
  environment_id integer,
  environment_name varchar
);

INSERT INTO environments_table (environment_id, environment_name)
VALUES
  (1, 'production'),
  (2, 'development'),
  (3, 'beta'),
  (4, 'qas'),
  (5, 'reserved'),
  (6, 'preproduction'),
  (7, 'test'),
  (8, 'admin');


/***********************************
*          ASSET_ENVS_TABLE        *
************************************/


/***********************************
*           CHASSIS_TABLE          *
************************************/

CREATE TABLE chassis_table (
  asset_id integer,
  ilo_address varchar,
  number_of_slots integer,
  slot_1 integer,
  slot_2 integer,
  slot_3 integer,
  slot_4 integer,
  slot_5 integer,
  slot_6 integer,
  slot_7 integer,
  slot_8 integer,
  slot_9 integer,
  slot_10 integer,
  slot_11 integer,
  slot_12 integer,
  slot_13 integer,
  slot_14 integer,
  slot_15 integer,
  slot_16 integer
);

INSERT INTO chassis_table (
  asset_id,
  ilo_address,
  number_of_slots,
  slot_1,
  slot_2,
  slot_3, 
  slot_4, 
  slot_5, 
  slot_6, 
  slot_7,
  slot_8,
  slot_9,
  slot_10,
  slot_11,
  slot_12,
  slot_13,
  slot_14,
  slot_15,
  slot_16
)
VALUES
  (
    2,
    'random_ilo',
    8,
    2,
    0, 
    0, 
    0, 
    0, 
    0, 
    0, 
    0, 
    0, 
    0, 
    0, 
    0, 
    0, 
    0, 
    0, 
    0 
  );

/***********************************
*           CHASSIS_TABLE          *
************************************/


/***********************************
*           BLADE_TABLE            *
************************************/

CREATE TABLE blade_table (
  asset_id integer,
  chassis varchar,
  chassis_slot_number integer,
  parent_asset_id integer
);

INSERT INTO blade_table (asset_id, chassis, chassis_slot_number, parent_asset_id)
VALUES
  (3, 'test_chassis-1', 1, 2);

  INSERT INTO asset_table (
    asset_name,
    asset_type,
    asset_make,
    asset_model,
    asset_environment,
    asset_function,
    physical_or_virtual,
    applications,
    serial_number,
    data_center,
    move_group,
    os,
    cpu,
    ram,
    disk_size,
    disk_provisioned,
    ip_address,
    all_ips,
    subnet,
    gateway,
    vlan,
    domain_name,
    db_dependency,
    db_asset_dependencies,
    network_dependencies,
    fileshare_dependencies,
    clustered,
    cluster_nodes,
    load_balanced ,
    vip_requirements,
    firewall,
    dmz,
    storage_dependencies,
    server_dependencies,
    notes,
    is_chassis,
    is_blade 
  )
  VALUES
    (
     'test_server-1', 
     1, 
     'dell', 
     'serve1234', 
     1, 
     'Web Server', 
     'Virtual', 
     '{"app-1", "app-2"}', 
     78654, 
     'New York', 
     'N/A', 
     'Windows Server 2012', 
     2, 
     8, 
     500, 
     'Test', 
     '10.2.162.1', 
     '{"10.2.162.1", "10.2.164.1"}', 
     'test', 
     'test', 
     'test', 
     'test_domain', 
     'mongodb', 
     '{"asset-1", "asset-2"}', 
     '{"network-1", "network-2"}', 
     '{"file-share1", "file-share2"}', 
     false, 
     '{}', 
     true, 
     'N/A', 
     '{"firewall-1", "firewall-2"}', 
     false, 
     '{}', 
     '{}', 
     '', 
     false, 
     false
     ),
     (
     'test_blade-1', 
     8,
     'hp',
     'blade1234', 
     1,
     'Chassis',
     'Physical',
     '{"app-1", "app-2"}', 
     78658,
     'New York', 
     'N/A', 
     'N/A', 
     0, 
     0,
     0,
     'Test', 
     'N/A', 
     '{}',
     'test', 
     'test', 
     'test', 
     'N/A', 
     'N/A',
     '{"asset-1", "asset-2"}',
     '{"network-1", "network-2"}',
     '{"file-share1", "file-share2"}', 
     false, 
     '{}',
     true,
     'N/A',
     '{"firewall-1", "firewall-2"}',
     false, 
     '{}', 
     '{}',
     '',
     false,
     true
     ),
     (
     'test_chassis-1', 
     7,
     'hp', 
     'chassis1234', 
     1, 
     'Chassis', 
     'Physical', 
     '{"app-1", "app-2"}', 
     78658, 
     'New York', 
     'N/A', 
     'N/A', 
     0, 
     0, 
     0, 
     'Test', 
     'N/A', 
     '{}', 
     'test', 
     'test', 
     'test', 
     'N/A', 
     'N/A', 
     '{"asset-1", "asset-2"}', 
     '{"network-1", "network-2"}', 
     '{"file-share1", "file-share2"}', 
     false, 
     '{}', 
     true, 
     'N/A', 
     '{"firewall-1", "firewall-2"}', 
     false, 
     '{}', 
     '{}', 
     '', 
     true, 
     false
     );