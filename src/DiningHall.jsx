import React, {Component} from 'react';
import {Redirect} from 'react-router';
import {DINING_HALLS} from './helper.jsx';
import Button from './Button.jsx';
import Menu from './Menu.jsx';

import './DiningHall.css';

class DiningHall extends Component {

  constructor(props) {
    super(props);
    this.state = {
      id: this.props.match.params.dining_hall,
      name: DINING_HALLS[this.props.match.params.dining_hall.toLowerCase()],
      cur_meal: 'breakfast'
    }
  } 

  componentDidMount() {
    document.title = this.state.name;
  }

  handleClick(e) {
    let new_cur_meal = e.target.innerText.toLowerCase();
    this.setState({
      cur_meal : new_cur_meal
    });
  }

  render() {
    if(this.state.name === undefined) {
      return (<Redirect to="/" />);
    }

    return (
      <div className='dh-menu-container nice-font'>
        <div className='title'>
          <span> {this.state.name} </span>
        </div>
        <div className='button-group-container'>
          <Button name='Breakfast' onClick= {this.handleClick.bind(this)} />
            <Button name='Lunch' onClick= {this.handleClick.bind(this)} />
          <Button name='Dinner' onClick= {this.handleClick.bind(this)} />
        </div>
        <div className='menu-container'>
            <Menu id={this.state.id} cur_meal={this.state.cur_meal}></Menu>
          </div>
      </div>
    );
  }
}

export default DiningHall;
