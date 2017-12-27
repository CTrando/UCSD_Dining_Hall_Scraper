const request = require('request');
const cheerio = require('cheerio');
const mysql = require('mysql');
const readline = require('readline');
const { Client, Pool } = require('pg');

const website = 'https://hdh.ucsd.edu/DiningMenus/default.aspx?i=05#';
//const conString = 'postgres://llncppnenmbbgn:965b78af87e997063878bab1307ef226d4ed145a53db9468e972fbee1fee204d@ec2-50-19-251-65.compute-1.amazonaws.com:5432/d4cr6a4tjf72ri';


const connection = new Pool({
  user: 'llncppnenmbbgn',
  host: 'ec2-50-19-251-65.compute-1.amazonaws.com',
  database: 'd4cr6a4tjf72ri',
  password: '965b78af87e997063878bab1307ef226d4ed145a53db9468e972fbee1fee204d',
  port: 5432,
  ssl: true
});


/*
  const connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'ctrando',
  password : 'ctrando',
  database : 'dininghalls',
  port: 3306
});
*/

const DINING_HALLS = {
  "OceanView": 'ovt',
  "Canyon": 'cv',
  "64": '64degrees',
  "Foodworx": 'foodworx',
  "Pines": 'pines',
  "Cafe": 'cafev'
}

function make_table(table_name){
  table_name = table_name.toLowerCase();
  connection.query(`CREATE TABLE IF NOT EXISTS"${table_name}" (type TEXT, food TEXT)`, 
  (err) => {
//    console.log(err);
    console.log(`${table_name} created successfully!`);
  });
}

function start() {
  connection.connect();
}

function create_tables() {
  Object.values(DINING_HALLS).forEach(function(value) {
    console.log(value);
    make_table(value);
  });
}

function drop_tables(callback) { 
  Object.values(DINING_HALLS).forEach(function(drop_hall) {
    console.log(`Dropping ${drop_hall}`);
    connection.query(`DROP TABLE IF EXISTS "${drop_hall}"`, (err) => {
     // console.log(err);
    });
  });
  callback();
}

function reset() { 
  Object.values(DINING_HALLS).forEach(function(drop_hall) {
    console.log(`Dropping ${drop_hall}`);

    connection.query(`DROP TABLE IF EXISTS "${drop_hall}"`, 
      (err) => {
        make_table(drop_hall)
      }
    );
  });
}

function insert(table_name, information) {
  table_name = table_name.toLowerCase();
  // creating the column and value strings to be inserted
  column_str = [];
  value_str = [];

  for(let [key, value] of Object.entries(information)) {
    value = value.replace("'", "''");
    column_str.push(key);
    value_str.push("'"+ value + "'");
  }

  // joining them in a list separated by commas
  column_str = column_str.join(',');
  value_str = value_str.join(',');
  connection.query(`INSERT INTO ${table_name} (${column_str}) VALUES (${value_str})`);
}

function get_menu(dining_hall, meal, callback) {
  dining_hall = dining_hall.toLowerCase();
  if(meal ==  undefined) {
    connection.query(`SELECT * FROM "${dining_hall}"`, function(err, results) {
      if(!err) {
        callback(results['rows']);
      } else {
        console.log(err);
      }
    });
  } else {
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
  dh_name = dh_name.toLowerCase();
  connection.query(`SELECT DISTINCT type FROM "${dh_name}"`, 
    (err, results) => {
      if(!err) {
        callback(results['rows']);
      } else {
        console.log(err);
      }
    });
}

function end() {
  connection.end();
}


module.exports = {
  get_menu: get_menu, 
  reset: reset,
  end: end,
  start: start,
  create_tables: create_tables,
  drop_tables: drop_tables,
  get_dh_status: get_dh_status,
  insert: insert
}

