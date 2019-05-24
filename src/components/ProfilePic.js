import React from 'react';
import './ProfilePic.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class ProfilePic extends React.Component {
  newpic = () => {
    window.deleteUserEnrollment()
    setTimeout(() => window.startEnrollment(), 5000)
  }


  render() {

    return(
    <div className="ProfilePic">
      <h2>Profilbilde</h2>
      <div id="cameraBox">
        <img className="faceImg" alt="userFace" src={window.localStorage.getItem('matchedFace')}></img>
      </div>
      <Link className="linkBtn" id="brukBtn" to="/Samtykke">Bruk</Link>
      <Link onClick={this.newpic} className="linkBtn" id="nyttBtn" to="/TakePic">Nytt</Link>
      {/*<Link className="linkBtn" id="betalBtn" to="/">Avbryt</Link>*/}
    </div>
    );
  }   
}

export default ProfilePic;