// from node modules
import React, {Component} from 'react';
import {Link} from 'react-router-dom';

// my source
import './DiningHallDescriptor.css';
import {insertion_sort} from './helper.jsx';

// my pictures
import breakfast from './images/breakfast.png';
import lunch from './images/lunch.png';
import dinner from './images/dinner.png';

// where the images for the descriptor is stored
const images = {
  breakfast: breakfast,
  lunch: lunch,
  dinner: dinner
}

class DiningHall extends Component{

  constructor(props) {
    // init super class
    super(props);

    /**
     * State object for DiningHall. 
     *
     * @param ID The ID for this DiningHall e.g ovt, cv, cafev
     * @param name The actual name for the DiningHall e.g OceanViewTerrace
     * @param data The raw data from each post request to the express server - JSON form
     * @param open Whether this dining hall is open or not
     * @param meals The currently open meals e.g (Breakfast, Lunch or Dinner)
     */

    this.state = {
      id: this.props.id, 
      name: this.props.name,
      data: [],
      // whether it is open or not 
      open: false,
      // currently open meals
      meals: [],
    };
  }

  componentDidMount() {
    // make the UI update every second with setInterval 
    this.intervalID = setInterval(
      () => this.updateStatus(), 1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  updateStatus() {
    this.updateData();
    this.updateOpenStatus();
  }

  updateOpenStatus() {
    // checks to see if there are any open meals
    // sets open to true or false based on that result
    if(this.state.meals.length === 0) {
      this.setState({open: false});
    } else {
      this.setState({open: true});
    }
  }

  updateData() { 
    // using variable to contain context because cannot figure out 
    // how to do it with fetch 
    let self = this;
    // request body contains DiningHall ID 
    let reqBody = {
      id : this.state.id
    };

    // making our fetch request to /status endpoint
    fetch('/status', {
      method: 'POST',
      // need this part to make sure it knows we are sending JSON
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      // convert reqBody to JSON
      body: JSON.stringify(reqBody)
    })
    // fetch returns promise of promise, which we need to resolve by returning JSON
      .then(function(response) {
        return response.json();
      })
    // here is the real function which has the data 
      .then(function(response_data) {
        // response data is a list of dictionaries containing the type of meal
        // goes Breakfast: temp, Lunch: hi etc.

        // Use log for debug purposes
        //console.log(response_data);
        // set data to response data in case we need it
        self.setState({data: response_data});

        // loop over each meal and see which ones are open
        // guarenteed to be unique by distinct query in /status endpoint
        let open_meals = [];
        response_data.forEach((entry) => {
          // lowercasing to keep everything consistent
          let type = entry['type'].toLowerCase();
          open_meals.push(type);
        });
        
        // sorting based on weighted values order will always go Breakfast first, Lunch
        // second and Dinner third
        self.setState({meals: insertion_sort(open_meals)});
      }).catch(function(error) {
        console.log('Something went wrong here.');
      });
  }

  render() {
    // setting link variable before hand as # 
    let link = '#';
    // update it if the dining hall is open
    // this is to ensure that only dining halls with food can be looked at
    if(this.state.open) {
      link = '/dh/' + this.props.id;
    }

    return (
      <div className="dh-flex-container">
        <div className= "dh-container nice-font">
          <Link to={link}>
            <div className="dh-title">
              {this.props.name} 
            </div> 

            <div className="dh-status"> 
              { 
                this.state.meals.map((name, index) => {
                  return <img key={index} src= {images[name]} />
                })
              }
            </div>

          </Link>
        </div>
      </div>
    );
  }
}

export default DiningHall;
