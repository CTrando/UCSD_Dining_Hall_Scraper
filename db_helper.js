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

make_table = function(table_name){
  connection.query('CREATE TABLE IF NOT EXISTS ' + table_name + '(ID int NOT NULL PRIMARY KEY AUTO_INCREMENT, type TEXT, food TEXT)');
}

module.exports = {
  start: function() {
    connection.connect();
  },

  create_tables: function() {
    Object.values(DINING_HALLS).forEach(function(value) {
      console.log(value);
      make_table(value);
    });
  }, 

  drop_tables: function(callback) {
    input.question(warning_str, function(answer) {
      if(answer === 'y') {
        console.log('Very well');
        let keys = Object.keys(DINING_HALLS);
        keys.forEach(function(key) {
          let drop_hall = DINING_HALLS[key];
          console.log(`Dropping ${drop_hall}`);
          connection.query("DROP TABLE IF EXISTS " + DINING_HALLS[key]);
        });
      } else {
        console.log('You have made the correct choice');
      }
      input.close();
      callback();
    });
  },

  insert: function(table_name, information) {
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
  }, 

  is_valid_table: function(table_name) {
    return DINING_HALLS[table_name] != undefined;
  },
  
  get_dining_hall: function(key) {
    return DINING_HALLS[key];
  },

  get_menu: function(dining_hall, meal, callback) {
    connection.query(`SELECT * FROM ${dining_hall} WHERE type='${meal}'`, 
      function(err, results, fields) {
        if(!err) {
          callback(results);
        }
      });
  },

  end: function() {
    connection.end();
  }
}

