CREATE TABLE users_table (
  user_id SERIAL UNIQUE,
  user_email varchar,
  user_password varchar,
  user_name varchar,
  user_role integer
);

INSERT INTO users_table (user_email, user_password, user_name, user_role)
	VALUES
		('wohms@curvature.com', 'commissioner1', 'Will Ohms', 1),
    ('tmurph850@gmail.com', 'Rajah2077$$', 'Tim Murphy', 1);