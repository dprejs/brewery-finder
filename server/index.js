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
  db.addUser(req.body.name)
  .then(() => res.sendStatus(201))
  .catch((err) => {
    console.log('error adding name', err);
    res.sendStatus(500);
  })
})

app.listen(PORT, () => {
  console.log(`Make me suffer at port ${PORT}!`);
});