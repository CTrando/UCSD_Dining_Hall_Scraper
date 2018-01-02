// from npm modules
const request = require('request');
const cheerio = require('cheerio');

// from my code
const db = require('./db_helper.js');

// hardcoding the websites to reduce time it takes to request html
const websites = {
  'OVT': 'https://hdh.ucsd.edu/DiningMenus/default.aspx?i=05',
  '64Degrees': 'https://hdh.ucsd.edu/DiningMenus/default.aspx?i=64',
  'CafeV': 'https://hdh.ucsd.edu/DiningMenus/default.aspx?i=18',
  'CV': 'https://hdh.ucsd.edu/DiningMenus/default.aspx?i=24',
  'Foodworx': 'https://hdh.ucsd.edu/DiningMenus/default.aspx?i=11',
  'Pines': 'https://hdh.ucsd.edu/DiningMenus/default.aspx?i=01'
};

// root website just in case 
const root_website = 'https://hdh.ucsd.edu/DiningMenus/';

/**
 * Will store the dining hall menus into the SQL database using the 
 * database helper script imported at the top.
 *
 * @param store_name the name of the store
 * @param link the link to the store
 * @callback callback function
 */

function storeDHMenus(store_name, link, callback) { 
  // make the HTML request to the website
  request(link, function (err, response, html) {
    // making the two lists for the meals and the food so can pair up each meal with each food menu 
    let foods = [];
    let meals = [
      'Breakfast',
      'Lunch',
      'Dinner'
    ];

    if (!err && response.statusCode == 200) {
      // loading html into cheerio to parse 
      let $ = cheerio.load(html);

      // selects each menu for each time of meal, puts breakfast into 
      // 0, lunch into 1, and dinner into 2
      // i is the index of the number of td.menuLists in the page, menu is 
      // the actual content
      
      $('td.menuList').each(function(i, menu) {
        // food is the specific menu for this dining hall at a certain meal        
        let food = []
        
        // menu is the html for the menu, parsing through it to look for food
        $(menu).children('ul').children('li').each(function(j, item) {
          // adding food text to food list 
          let food_text = $(item).text();
          food.push(food_text);
        });
        
        // adding food to foods
        foods.push(food);
      });

      // idea here is that the meals and food meals should have the same number of items,
      // so we can map them together sequentially 
      let food_count = 0;

      meals.forEach(function(meal) {
        foods[food_count].forEach(function(food) {
          if(food.indexOf('$') != -1) {
            db.insert(store_name, {
              'type': meal,
              'food': food,
            });
          }
        });
        food_count++;
      });

      // make sure to call the callback at the end to say we are done
      callback();
    } else {
      // log the error
      console.log("Error has occured");
      console.log(err);
    }
  });
}

function update() {
  // reset the table state
  db.reset();
  
  // run the update command on each dining hall 
  Object.entries(websites).forEach(function([name, website_link]) {
    // making the callback function just print the name of the dining hall and its link
    storeDHMenus(name, website_link, function() {
      console.log(`Finished scraping from ${name} at link ${website_link}`);
    });
  });
}

// only visible method will be the update method
module.exports = {
  update: update,
}

