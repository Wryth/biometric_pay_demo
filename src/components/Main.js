import React from 'react';
import './Main.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import Zoom from "./Zoom";
import TakePic from "./TakePic";
import EnterInfo from './EnterInfo';
import ZoomEnroll from './ZoomEnroll';
import Start from "./Start";
import Pay from "./Pay";
import Confirm from "./Confirm";
import ZoomCamera from "./ZoomCamera";

class Main extends React.Component {

  render() {
  return (    
    <div className="Main">
      <ZoomCamera />
      <Router>
      <div className="Container">
      <Route exact path="/" component={Start} />
      <Route path="/EnterInfo" component={EnterInfo} />
      <Route path="/Enroll" component={TakePic} />
      <Route path="/Pay" component={Pay} />
      <Route path="/Confirm" component={Confirm} />
      </div>
      </Router>
    </div>
  );
  }
}

export default Main;
