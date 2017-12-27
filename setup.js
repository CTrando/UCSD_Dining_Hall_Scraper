const db = require('./db_helper.js');

function setup() {
  db.reset();
}

module.exports = {
  setup: setup
}

setup();

