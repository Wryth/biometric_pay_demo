import React from 'react';
import './Start.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class Start extends React.Component {

  render() {
    return(
      <div className="Start">
          <Link className="linkBtn" id="enRollBtn" to="/EnterInfo">Enroll</Link>
          <Link className="linkBtn" id="betalBtn" to="/VelgVare">Betal</Link>
          <h1>{this.props.saveState}</h1>
      </div>
    );
  }   
}

export default Start;