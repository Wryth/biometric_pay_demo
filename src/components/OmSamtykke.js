import React from 'react';
import './OmSamtykke.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class OmSamtykke extends React.Component {

  render() {
    return(
    <div className="Confirm">
        <h2>Hei {this.props.states.userName}</h2>
        <div id="cameraBox">
        <img className="faceImg" alt="userFace" src={window.localStorage.getItem('matchedFace')}/>
        </div>
        <p>Mobil: {this.props.states.userNumber}</p>
        <p>Du er snart klar til å ta i bruk Betal med ett smil, men før vi går videre må vi be om ditt samtykke til å innhente noe mer data om deg. Du trenger BankID på mobil for å gå videre</p>
        <Link className="linkBtn" id="betalBtn" to="/">Avbryt</Link>
        <Link className="linkBtn" id="betalBtn" to="/Samtykke">Neste</Link>
    </div>
    );
  }   
}

export default OmSamtykke;