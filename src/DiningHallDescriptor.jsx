import React, {Component} from 'react';
import './DiningHallDescriptor.css';
import {insertion_sort} from './helper.jsx';

import breakfast from './images/breakfast.png';
import lunch from './images/lunch.png';
import dinner from './images/dinner.png';

const images = {
  breakfast: breakfast,
  lunch: lunch,
  dinner: dinner
}

class DiningHall extends Component{

  constructor(props) {
    super(props);
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
    this.intervalID = setInterval(
      () => this.updateStatus(), 1000
    );
  }

  updateStatus() {
    this.updateData();
    this.updateUI();
  }

  updateUI() {
    if(this.state.data.length === 0) {
      this.setState({open: false});
    } else {
      this.setState({stat: true});
    }
  }

  updateData() { 
    let s = this;
    let reqBody = {
      id : this.state.id
    };

    fetch('/status', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reqBody)
    }).then(function(response) {
      return response.json();
    }).then(function(response_data) {
      // response data is a list of dictionaries containing the type of meal
      console.log(response_data);
      s.setState({data: response_data});

      // loop over each meal and see which ones are open
      // guarenteed to be unique by distinct query 
      let open_meals = [];
      response_data.forEach((entry) => {
        let type = entry['type'];
        open_meals.push(type);
      });
      s.setState({meals: insertion_sort(open_meals)});

    }).catch(function(error) {
      console.log('Something went wrong here');
    });
  }

  render() {
    return (
      <div className="dh-flex-container">
        <div className= "dh-container nice-font">
          <span className="dh-title">
            <a href= {this.props.id}>
              {this.props.name}
            </a>
          </span> 
          <div className="dh-status"> 
            { 
              this.state.meals.map((name, index) => {
              return <img key={index} src= {images[name]} />
              })
            }
          </div>
        </div>
      </div>
    );
  }
}

export default DiningHall;
