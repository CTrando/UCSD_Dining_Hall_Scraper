// imports from react
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const schedule = require('node-schedule');

// imports from files
const scrape = require('./scrape.js');
const db = require('./db_helper.js');

// setting default port to be 4000
const PORT = process.env.PORT || 4000;

// cron job for scraping every minute
var job = schedule.scheduleJob('59 * * * *', function() {
  scrape.update();
});

// telling express how to interpret POST requests
app.use(bodyParser.json());

// post request to /items endponit
app.post('/items', (req, res) => {
  // getting dining hall name
  let db_name = req.body['id'];
  // returning the JSON from the db request with that dining hall
  db.get_menu(db_name, undefined, (result) => {
    res.send(JSON.stringify(result));
  });
});

// post request for /status endpoint
app.post('/status', (req, res) => {
  // getting ID from request
  let db_name = req.body['id'];
  // sending back the data from query 
  db.get_dh_status(db_name, (result) => {
    res.send(JSON.stringify(result));
  });
})

// on default get request just return index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// on get request with /dh return the index.html 
// this is in order to make sure react handles the routing not express
app.get("/dh/*", (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// setting up the static path 
app.use(express.static(path.join(__dirname, 'build')));

// making it listen
app.listen(PORT, () => 
  console.log(`Test app running at port ${PORT}`));



