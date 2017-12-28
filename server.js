const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

const scrape = require('./scrape.js');
const db = require('./db_helper.js');
const schedule = require('node-schedule');
const PORT = process.env.PORT || 4000;


var job = schedule.scheduleJob('*/1 * * * *', function() {
 // scrape.update();
});

app.use(bodyParser.json());


app.post('/items', (req, res) => {
  let db_name = req.body['id'];
  db.get_menu(db_name, undefined, (result) => {
    res.send(JSON.stringify(result));
  });
});

app.post('/status', (req, res) => {
  let db_name = req.body['id'];
  db.get_dh_status(db_name, (result) => {
    res.send(JSON.stringify(result));
  });
})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get("/dh/*", (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.use(express.static(path.join(__dirname, 'build')));

app.listen(PORT, () => 
  console.log(`Test app running at port ${PORT}`));



