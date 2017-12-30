import React, {Component} from 'react';
import './DiningHallDescriptor.css'; 
import './Landing.css'; 
import DiningHall from './DiningHallDescriptor.jsx';

class Landing extends Component {

  render() {
    return (
      <div className='landing-container'>
        <DiningHall id="OVT" name="OceanView Terrace" />
        <DiningHall id= "CV" name="Canyon Vista" />
        <DiningHall id= "64Degrees" name="64 Degrees" />
        <DiningHall id= "CafeV" name="Cafe Ventanas" />
        <DiningHall id= "Foodworx" name="Foodworx" />
        <DiningHall id= "Pines" name="Pines" />
      </div>
    );
  }
}

export default Landing;
