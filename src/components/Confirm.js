import React from 'react';
import './Confirm.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class Confirm extends React.Component {

  render() {
    return(
    <div className="Confirm">
        <h2>Hei {this.props.states.userName}</h2>
        <div id="cameraBox"></div>
        <p>Du har betalt</p>
        <p>kr 23,80</p>
        <p>Du finner kvitteringen din i appen</p>
        <Link className="linkBtn" id="betalBtn" to="/">Avslutt</Link>
    </div>
    );
  }   
}

export default Confirm;