const readline = require('readline');
const db = require('./db_helper.js');

const input = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

const dh_question = 'What dining hall would you like to get information from?';
const meal_question = 'What meal would you like to get information about?';

input.on('close', function() {
  console.log('Input closed');
});

function main() {
  input.question(dh_question, function(dining_hall) {
    input.question(meal_question, function(meal) {
      console.log(`You are looking for ${meal} from ${dining_hall}`); 
      meal = meal.trim();
      dining_hall = dining_hall.trim();

      db.get_menu(dining_hall, meal, function(results) {
        Object.values(results).forEach(function(entry) {
          console.log(entry['food']);
        });
      });
    });
  });
}

main();
