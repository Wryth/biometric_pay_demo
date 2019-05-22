import React from 'react';
import './Confirm.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class Confirm extends React.Component {

  payComplete = () => {
    window.localStorage.removeItem("matchedUser");
    window.localStorage.removeItem('matchedFace');
  }

  render() {

    return(
    <div className="Confirm">
        <h2>Hei {window.localStorage.getItem("matchedUser")}</h2>
        <div id="cameraBox">
          <img className="faceImg" src={window.localStorage.getItem('matchedFace')} ></img>
        </div>
        <p>Du har betalt</p>
        <p className="totalSum">kr 23,80</p>
        <p>Du finner kvitteringen din i appen</p>
        <Link className="linkBtn" onClick={this.payComplete} id="betalBtn" to="/">Avslutt</Link>
    </div>
    );
  }   
}

export default Confirm;