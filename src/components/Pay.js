import React from 'react';
import './Pay.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class Pay extends React.Component {

  render() {
    return(
    <div className="Pay">
        <h2>Smil til kamera</h2>
        <div id="cameraBox"></div>
        <p>Du skal betale</p>
        <p className="totalSum">kr {this.props.states.totalSum}</p>
        <Link className="linkBtn" id="betalBtn" to="/Confirm">Bekreft</Link>
    </div>
    );
  }   
}

export default Pay;