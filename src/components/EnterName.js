import React from 'react';
import './EnterName.css';

class EnterName extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return(
    <div className="EnterName">
        <h1 id="omdeg">Om deg</h1>
        <form onSubmit={this.handleSubmit}>
            <label>
                <p>Name:</p>
                <input type="text" value={this.state.value} onChange={this.handleChange} placeholder="Enter Name" />
            </label>
            <input type="submit" value="Submit" />
        </form>
    </div>)
    }   
}

export default EnterName;