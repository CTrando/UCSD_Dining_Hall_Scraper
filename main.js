const scrape = require('./scrape.js');
const db = require('./db_helper.js');
const schedule = require('node-schedule');

var job = schedule.scheduleJob('*/1 * * * *', function() {
  scrape.update();
});




