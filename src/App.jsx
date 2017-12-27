import React from 'react';
import DiningHall from './DiningHall.jsx';
import Landing from './Landing.jsx';

import './DiningHallDescriptor.css';

import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';


const App = () => (
  <Router>
    <div className= "flex">
      <Route exact path="/" component={Landing}/>
      <Route path="/dh/:dining_hall" component={DiningHall} />
    </div>
  </Router>
);



export default App;
