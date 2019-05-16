import React from 'react';
import './Main.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import TakePic from "./TakePic";
import EnterInfo from './EnterInfo';
import ZoomEnroll from './ZoomEnroll';
import Start from "./Start";
import Pay from "./Pay";
import Confirm from "./Confirm";
import ZoomCamera from "./ZoomCamera";
import Samtykke from "./Samtykke";
import ProfilePic from "./ProfilePic";

class Main extends React.Component {
constructor(props){
  super(props);
  this.state = {
    camera: false,
    userName: 'Klara',
    userNumber: '921 12 345'
  };
}

updateState = (stateChange) => {
  this.setState(stateChange);
}

showCamera = (trueFalse) => {
  if (!this.state.camera === trueFalse){
    this.setState({
      camera: trueFalse
    })
  }
}

  render() {
  return (    
    <div className={`Main${this.state.camera ? ' showCamera' : ''}`}>
      <ZoomCamera />
      <Router>
        <div className="Container">

          <Route exact path="/" 
            render={() => {
              this.showCamera(false);
              return (
                <Start
                  states={this.state}
                  updateState={this.updateState}
                />)}}/>
          
          {/*Om deg; Bruker navn og telefonnr */}
          <Route path="/EnterInfo"
            render={() => {
              this.showCamera(false);
              return (
                <EnterInfo
                  states={this.state}
                  updateState={this.updateState}
                />)}}/>

          {/* */}
          <Route path="/Pay"
            render={() => {
              this.showCamera(true);
              return (
                <Pay
                  states={this.state}
                  updateState={this.updateState}
                />)}}/>
          

          <Route path="/TakePic"
            render={() => {
              this.showCamera(true);
              return (
                <TakePic 
                  states={this.state}
                  updateState={this.updateState}
                />)}}/>

          <Route path="/ProfilePic"
            render={() => {
              this.showCamera(true);
              return (
                <ProfilePic 
                  states={this.state}
                  updateState={this.updateState}
                />)}}/>
            
          <Route path="/Confirm" 
                      render={() => {
                        this.showCamera(true);
                        return (
                          <Confirm 
                            states={this.state}
                            updateState={this.updateState}
                          />)}}/>

          <Route path="/Samtykke" 
                      render={() => {
                        this.showCamera(true);
                        return (
                          <Samtykke 
                            states={this.state}
                            updateState={this.updateState}
                          />)}}/>

        </div>
      </Router>
    </div>
  );
  }
}

export default Main;
