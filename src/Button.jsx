import React, {Component} from 'react';
import './DiningHall.css';

class Button extends Component {

  render() {
    return (
      <div className='button-container'>
        <button onClick= {this.props.onClick}>
          <div className='button nice-font'>
            <span> {this.props.name} </span>
          </div>
        </button>
      </div>
    );
  }
}


export default Button;
