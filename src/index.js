import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import App from './App.jsx';
import mysql from 'mysql';

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

registerServiceWorker();
