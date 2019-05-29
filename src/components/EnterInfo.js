import React from 'react';
import './EnterInfo.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class EnterInfo extends React.Component {

  handleNameChange = (event) => {
    this.props.updateState({userName: event.target.value});
    window.localStorage.setItem('userName', event.target.value);
  }

  handleNumberChange = (event) => {
    this.props.updateState({userNumber: event.target.value});
    window.localStorage.setItem('userPhone', event.target.value);
  }

  handleSubmit(event) {
    alert('Navn: ');
    event.preventDefault();
  }

  render() {
    return(
    <div className="EnterInfo">
        <h2 id="omdeg">Om deg</h2>
        <form onSubmit={this.handleSubmit}>
              <p id="inputName">Navn</p>
              <input className="omdegInput" type="text" value={this.props.states.userName} onChange={this.handleNameChange} placeholder="" />
              <p className="omdegInfo">Slik at vi vet hva du heter</p>

              <p id="inputPhone">Mobilnummer</p>
              <input className="omdegInput" type="phone" value={this.props.states.userNumber} onChange={this.handleNumberChange} placeholder="" />
              <p className="omdegInfo">Vi sender deg en SMS med kode når du skal logge på appen</p>
        </form>

        <Link id="nextBtn" to="/TakePic">Neste</Link>
    </div>
    
    );
  }
}

export default EnterInfo;
