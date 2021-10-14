CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL
);
CREATE TABLE IF NOT EXISTS favorites (
  favorite_id SERIAL NOT NULL,
  user_id INT NOT NULL REFERENCES users (id),
  id VARCHAR,
  name VARCHAR,
  brewery_type VARCHAR,
  street VARCHAR,
  city VARCHAR,
  state VARCHAR,
  postal_code VARCHAR,
  country VARCHAR,
  longitude DECIMAL,
  latitude DECIMAL,
  phone INT,
  website_url VARCHAR,
  comment VARCHAR
);