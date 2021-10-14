const { Pool, Client } = require('pg');
const password = require('./../config.js').db;
const PORT = 5432;

const pool = new Pool({
  host: 'localhost',
  user: 'dprejs',
  password: password,
  database: 'mvp',
  port: PORT
})
pool.connect((err, client, release) => {
  if(err) {
    console.log(`error conecting to db at port ${PORT}`, err.stack);
  } else {
    console.log(`connected to postgres at port: ${PORT}`);
  }
})
const addUserQuery = (value) => {
  return {
    name: 'add-user',
    text: `INSERT INTO users
    (name)
    VALUES ($1)
    RETURNING id`,
    values: [value]
  }
}
const getUserQuery = (value) => {
  return {
    name: 'get-user',
    text: `SELECT * FROM users
    WHERE name = $1`,
    values: [value]
  }
}
const addFavoriteQuery = (values) => {
  return {
    name: 'add-favorite',
    text: `INSERT INTO favorites
    (user_id, id, name, brewery_type, street, city, state, postal_code, country, longitude, latitude, phone, website_url, comment)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
    values: [values.user_id, values.id, values.name, values.brewery_type, values.street, values.city,
    values.state, values.postal_code, values.country, values.longitude, values.latitude, values.phone,
    values.website_url, values.comment]
  }
}

module.exports = {
  addUser: (user) => {
    return pool.query(addUserQuery(user))
  },
  checkIfUserExists: (user) => {
    return pool.query(getUserQuery(user))
  },
  addFavorite: (favorite) => {
    return pool.query(addFavoriteQuery(favorite))
  }
}