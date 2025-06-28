// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MainForm from './MainForm';
import UserDetails from './userDetails';
import SharedInfo from './SharedInfo'; 

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={MainForm} />
        <Route path="/user-details" component={UserDetails} />
        <Route path="/shared-info/:encodedData" component={SharedInfo} /> 
      </Switch>
    </Router>
  );
}

export default App;
