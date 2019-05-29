import React from 'react';
import './VelgVare.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class VelgVare extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            sum: 0,
            selected: false
        };
      }
      

  payComplete = () => {
    this.props.updateState({totalSum: this.state.selected ? "19,90": 0});
    //window.localStorage.setItem('userName', event.target.value);
  }

  selectVare = () => {
      this.setState({selected: !this.state.selected})
  }

  render() {

    return(
    <div className="VelgVare">
        <h2>Velg varer</h2>
        <div id="cameraBox">
            <div onClick={this.selectVare} className={`vare ${this.state.selected ? 'selected' : ''}`}>
                <img className="vareImg" src={process.env.PUBLIC_URL + "images/smil.png"}></img>
                <p className="vareNavn">Smil</p>
                <p className="varePris">19,90</p>
            </div>

        </div>
        <p>Du skal betale</p>
        <p className="totalSum">kr {this.state.selected ? "19,90": 0}</p>
        <Link className="linkBtn" onClick={this.payComplete} id="betalBtn" to="/pay">Gå til betaling</Link>
    </div>
    );
  }   
}

export default VelgVare;