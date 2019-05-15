import React from 'react';
import './Confirm.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class Confirm extends React.Component {

  render() {
    return(
    <div className="Confirm">
        <h2>Hei Klara</h2>
        <div id="cameraBox"></div>
        <p>Du skal betale</p>
        <p>kr 23,80</p>
    </div>
    );
  }   
}

export default Confirm;