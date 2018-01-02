// from node modules
const cheerio = require('cheerio');
const { Client, Pool } = require('pg');

// connection to our database 
/*
const connection = new Pool({
  user: 'llncppnenmbbgn',
  host: 'ec2-50-19-251-65.compute-1.amazonaws.com',
  database: 'd4cr6a4tjf72ri',
  password: '965b78af87e997063878bab1307ef226d4ed145a53db9468e972fbee1fee204d',
  port: 5432,
  ssl: true
});
*/


const connection = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'hello',
  password: 'ctrando',
  port: 5432
});


// dictionary for mapping the long names to their code names
const DINING_HALLS = {
  "OceanView": 'ovt',
  "Canyon": 'cv',
  "64": '64degrees',
  "Foodworx": 'foodworx',
  "Pines": 'pines',
  "Cafe": 'cafev'
}

/**
 * Make one table.
 *
 * @param table_name the name of the table
 */

function make_table(table_name){
  // lowercasing the table name to ignore case
  table_name = table_name.toLowerCase();
  connection.query(`CREATE TABLE IF NOT EXISTS"${table_name}" (type TEXT, food TEXT)`, 
    (err) => {
      if(err) {
        console.log(`Creating ${table_name} failed.`);
      } else {
        console.log(`${table_name} created successfully!`);
      }
  });
}

/**
 * Create all the dining hall tables.
 */

function create_tables() {
  // go through each one and make the table for it 
  Object.values(DINING_HALLS).forEach(function(value) {
    console.log(value);
    make_table(value);
  });
}

/**
 * Clear all the tables.
 *
 * @param callback the callback function
 */

function clear_tables(callback) { 
  // loop through all ofthem 
  Object.values(DINING_HALLS).forEach(function(drop_hall) {
    console.log(`Clearing ${drop_hall}`);
    connection.query(`DELETE FROM "${drop_hall}"`, (err) => {
      console.log(err);
    });
  });
  callback();
}

function reset() { 
  // go through each dining hall
  Object.values(DINING_HALLS).forEach(function(drop_hall) {
    // clearing the dining hall
    console.log(`Clearing ${drop_hall}`);
    connection.query(`DELETE FROM "${drop_hall}"`, (err) => {
      if(err) {
        console.log(`Failed to clear table ${drop_hall}`);
      } else {
        // making the table right after with a callback 
        make_table(drop_hall)
      }
    });
  });
}

function insert(table_name, information) {
  // case checking
  table_name = table_name.toLowerCase();
  // creating the column and value strings to be inserted
  column_str = [];
  value_str = [];

  // using string manipulation here, could be sped up 
  for(let [key, value] of Object.entries(information)) {
    value = value.replace("'", "''");
    column_str.push(key);
    value_str.push("'"+ value + "'");
  }

  // joining them in a list separated by commas
  column_str = column_str.join(',');
  value_str = value_str.join(',');
  // doing the query 
  connection.query(`INSERT INTO ${table_name} (${column_str}) VALUES (${value_str})`);
}

function get_menu(dining_hall, meal, callback) {
  // case checking
  dining_hall = dining_hall.toLowerCase();
  // if undefined just assume didn't ask for a meal
  if(meal ==  undefined) {
    connection.query(`SELECT * FROM "${dining_hall}"`, function(err, results) {
      if(!err) {
        callback(results['rows']);
      } else {
        console.log(err);
      }
    });
  } else {
    // otherwise use the meal 
    connection.query(`SELECT * FROM "${dining_hall}" WHERE type='${meal}'`, 
      function(err, results) {
        if(!err) {
          callback(results['rows']);
        } else {
          console.log(err);
        }
      });
  }
}

function get_dh_status(dh_name, callback) {
  // case checking
  dh_name = dh_name.toLowerCase();
  // looks for distinct items in type column 
  connection.query(`SELECT DISTINCT "type" FROM "${dh_name}"`, 
    (err, results) => {
      if(!err) {
        callback(results['rows']);
      } else {
        console.log(err);
      }
    });
}

module.exports = {
  get_menu: get_menu, 
  reset: reset,
  create_tables: create_tables,
  clear_tables: clear_tables,
  get_dh_status: get_dh_status,
  insert: insert
}

