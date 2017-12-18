const db = require('./db_helper.js');

function setup() {
  db.drop_tables(db.create_tables);
}

module.exports = {
  setup: setup
}

setup();

