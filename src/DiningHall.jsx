import React, {Component} from 'react';
import './DiningHall.css';

class DiningHall extends Component{

  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id, 
      name: this.props.name,
      data: [],
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

    fetch('/data', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reqBody)
    }).then(function(response) {
      return response.json();
    }).then(function(response_data) {
      console.log(response_data);
      s.setState({data: response_data});
    }).catch(function(error) {
      console.log('Something went wrong here');
    });
  }

  render() {
    return (
      <div className="dh-flex-container">
        <div className= "dh-container">
          <span className="center-text">{this.props.name}</span>
          <span className="open-status"> {this.state.stat} </span>
        </div>
      </div> 
    );
  }
}

export default DiningHall;
