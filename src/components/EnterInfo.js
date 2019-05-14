import React from 'react';
import './EnterInfo.css';

class EnterInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      number: ''
    };

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleNumberChange = this.handleNumberChange.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleNameChange(event) {
    this.setState({name: event.target.value});
  }

  handleNumberChange(event) {
    this.setState({number: event.target.value});
  }

  handleSubmit(event) {
    alert('Navn: ' + this.state.name + '\nNummer:' + this.state.number);
    event.preventDefault();
  }

  render() {
    return(
    <div className="EnterInfo">
        <p id="omdeg">Om deg</p>
        <form onSubmit={this.handleSubmit}>
              <p id="inputName">Navn</p>
              <input className="omdegInput" type="text" value={this.state.name} onChange={this.handleNameChange} placeholder="" />
              <p className="omdegInfo">Slik at vi vet hva du heter</p>
              <p id="inputPhone">Mobilnummer</p>
              <input className="omdegInput" type="phone" value={this.state.number} onChange={this.handleNumberChange} placeholder="" />
              <p className="omdegInfo">Vi sender deg en SMS med kode når du skal logge på appen</p>
        </form>
        <button id="nextBtn" onClick={this.handleSubmit}>Neste</button>
    </div>
    );
  }   
}

export default EnterInfo;