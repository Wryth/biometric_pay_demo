import React from 'react';
import './Main.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import Zoom from "./Zoom";
import TakePic from "./TakePic";
import EnterInfo from './EnterInfo';
import ZoomEnroll from './ZoomEnroll';

class Main extends React.Component {

  render() {
  return (    
    <Router>
    <div className="Main">
      <Route exact path="/" component={EnterInfo} />
      <Route path="/Enroll" component={TakePic} />
    </div>
    </Router>
  );
  }
}

export default Main;
