const request = require('request');
const cheerio = require('cheerio');
const mysql = require('mysql');
const readline = require('readline');

const website = 'https://hdh.ucsd.edu/DiningMenus/default.aspx?i=05#';
const warning_str ='This is a very dangerous move and it is highly recommended not to delete all the tables. Are you sure you wish to do this? (y/n) \n';

const input = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

input.on('close', function() {
  console.log('The input has been closed now');
});

const connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'ctrando',
  password : 'ctrando',
  database : 'dininghalls',
  port: 3306
});

const DINING_HALLS = {
  "OceanView": 'OVT',
  "Canyon": 'CV',
  "64": '64Degrees',
  "Foodworx": 'Foodworx',
  "Pines": 'Pines',
  "Cafe": 'CafeV'
}

function make_table(table_name){
  connection.query('CREATE TABLE IF NOT EXISTS ' + table_name + '(ID int NOT NULL PRIMARY KEY AUTO_INCREMENT, type TEXT, food TEXT)');
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
    connection.query("DROP TABLE IF EXISTS " + drop_hall);
  });
  callback();
}

function reset() {
  drop_tables(create_tables);
}

function insert(table_name, information) {
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
  if(meal ==  undefined) {
    connection.query(`SELECT * FROM ${dining_hall}`, function(err, results, fields) {
      if(!err) {
        callback(results);
      } else {
        console.log(err);
      }
    });
  } else {
  connection.query(`SELECT * FROM ${dining_hall} WHERE type='${meal}'`, 
    function(err, results, fields) {
      if(!err) {
        callback(results);
      } else {
        console.log(err);
      }
    });
  }
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
  insert: insert
}

