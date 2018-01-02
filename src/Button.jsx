import React, {Component} from 'react';
import './DiningHall.css';

class Button extends Component {

  render() {
    return (
      <div className='button-container'>
        <button className='nice-font' onClick= {this.props.onClick}>
            {this.props.name} 
        </button>
      </div>
    );
  }
}


export default Button;
