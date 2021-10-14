const express = require('express');
const path = require('path');
const db = require('./../database/index.js');

const PORT = 3000;
const app = express();

app.use(express.static(path.join(__dirname, '..', 'dist')));
app.use(express.json());

app.post('/user', (req, res) => {
  // console.log(req.body);
  // res.sendStatus(200);
  db.checkIfUserExists(req.body.name)
  .catch((err) => {
    console.log('error searching name', err)
  })
  .then((results) => {
    if (results.rows.length === 0) {
      db.addUser(req.body.name)
      .then((results) => {
        res.status(201)
        res.json(results.rows[0].id)
      })
      .catch((err) => {
        console.log('error adding name', err);
        res.sendStatus(500);
      })
    } else {
      // console.log(results.rows[0].id)
      res.status(200);
      res.json(results.rows[0].id);
    }
  })
})
app.post('/favorites', (req, res) => {
  db.addFavorite(req.body)
  .then(() => {
    console.log('favorite added')
    res.sendStatus(201)
  })
  .catch((err) => {
    console.log('error adding favorite', err)
    res.sendStatus(500)
  })
})

app.listen(PORT, () => {
  console.log(`Make me suffer at port ${PORT}!`);
});