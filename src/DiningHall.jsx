import React, {Component} from 'react';
import './DiningHall.css';

import breakfast from './breakfast.png';
import lunch from './lunch.png';
import dinner from './dinner.png';

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
      // currently open meals
      meals: [],
      stat: 'Open'
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
      this.setState({stat: 'Closed'});
    } else {
      this.setState({stat: 'Open'});
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
      s.setState({meals: open_meals.sort()});

    }).catch(function(error) {
      console.log('Something went wrong here');
    });
  }

  render() {
    return (
      <div className="dh-flex-container">
        <div className= "dh-container">
          <span className="dh-title">
            <a href= '#'>
              {this.props.name}
            </a>
          </span> 
          <div className="dh-status"> 
            { this.state.meals.map((name, index) => {
              return <img key={index} src= {images[name]} />
            
            //return <span key= {index}> {name} </span>
              })
            }
          </div>
        </div>
      </div>
    );
  }
}

export default DiningHall;
