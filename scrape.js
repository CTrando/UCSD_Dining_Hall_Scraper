const request = require('request');
const cheerio = require('cheerio');
const db = require('./db_helper.js');

const start_website = 'https://hdh.ucsd.edu/DiningMenus/default.aspx?i=05#';
const root_website = 'https://hdh.ucsd.edu/DiningMenus/';


let ret_menus = {};

function storeDHMenus(store_text, link, callback) { 
  console.log(link);
  console.log(store_text);

  request(link, function (error, response, html) {
    let foodMeals = []
    let meals = {
      'Breakfast': false,
      'Lunch': false,
      'Dinner': false
    }

    if (!error && response.statusCode == 200) {
      let $ = cheerio.load(html);

      // selects each menu for each time of meal 
      $('td.menuList').each(function(i, menu) {
        // food meal is the specific menu for this dining hall 
        let foodMeal = []
        $(menu).children('ul').children('li').each(function(j, item) {
          var a = $(item).text();
          foodMeal.push(a);
        });

        foodMeals.push(foodMeal);
      });

      // breakfast lunch or dinner 
      $('td.restaurantTitle').each(function(k, meal) {
        let meal_text = $(meal).text();
        if(meals[meal_text] != undefined) {
          meals[meal_text] = true;
        }
      });


      // idea here is that the meals and food meals should have the same number of items,
      // so we can map them together sequentially 
      
      let food_count = 0;

      for(let [meal, value] of Object.entries(meals)) {
        console.log(meal + ' ' +  value);
        if(value == false) continue;

        foodMeals[food_count].forEach(function(food) {
          if(food.indexOf('$') != -1) {
            db.insert(store_text, {
              'type': meal,
              'food': food,
            });
          }
        });

        food_count++;
      } 
    }
  });
}

function main(callback) {
  //db.create_tables();
  //db.drop_tables();
  request(start_website, function (error, response, html) {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(html);

      $('div#topnav.navigation ul li').children('a').each(function(i, store) {
          let store_text = $(store).text();
          let sep_store_text = store_text.split(' ');
          let first_word = sep_store_text[0];

          if(db.is_valid_table(first_word)) {
            let store_link = root_website+$(store).attr('href');
            storeDHMenus(db.get_dining_hall(first_word), store_link, callback);
          }                              
        });
    }
  });
}

main();
