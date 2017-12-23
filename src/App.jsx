import React from 'react';
import DiningHall from './DiningHall.jsx';
import Landing from './Landing.jsx';

import './DiningHall.css';

import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';


const App = () => (
  <Router>
    <div className= "flex">
      <Route exact path="/" component={Landing}/>
      <Route path="/ovt" render={(props) =>  <DiningHall dining_hall_name="ovt" /> } />
    </div>
  </Router>
);



export default App;
