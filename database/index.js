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
    VALUES ($1)`,
    values: [value]
  }
}
const getUserQuery = (value) => {
  return {
    name: 'get-user',
    text: `SELECT * FROM users
    WHERE name=$1`,
    values: [value]
  }
}

module.exports = {
  addUser: (user) => {
    return pool.query(addUserQuery(user))
  }
}