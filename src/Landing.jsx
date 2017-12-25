import React, {Component} from 'react';
import './DiningHallDescriptor.css';
import DiningHall from './DiningHallDescriptor.jsx';

import './Landing.css';


class Landing extends Component {

  render() {
    return (
      <div className="dining-hall">
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
