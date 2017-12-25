import React, {Component} from 'react';
import './DiningHall.css';

class Button extends Component {

  render() {
    return (
      <div className='button-container'>
        <a href='#' onClick= {this.props.onClick}>
          <div className='button'>
            <span> {this.props.name} </span>
          </div>
        </a>
      </div>
    );
  }
}


export default Button;
