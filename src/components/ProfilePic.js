import React from 'react';
import './ProfilePic.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class ProfilePic extends React.Component {
  render() {
    
    return(
    <div className="ProfilePic">
      <h2>Profilbilde</h2>
      <div id="cameraBox"></div>
      <Link className="linkBtn" to="/Samtykke">Bruk</Link>
      <Link className="linkBtn" to="/TakePic">Nytt</Link>
      {/*<Link className="linkBtn" id="betalBtn" to="/">Avbryt</Link>*/}
    </div>
    );
  }   
}

export default ProfilePic;