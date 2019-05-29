import React from 'react';
import './TakePic.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class TakePic extends React.Component {

  render() {
    
    return(
    <div className="TakePic">
    <div id="mockH2"></div>
    <div id="cameraBox"></div>
      <Link className="linkBtn" id="brukdette" to="/ProfilePic">Neste</Link>
    </div>
    );
  }   
}

export default TakePic;