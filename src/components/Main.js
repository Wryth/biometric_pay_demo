import React from 'react';
import './Main.css';
import Zoom from "./Zoom";
import EnterName from "./EnterInfo";
import TakePic from "./TakePic";

class Main extends React.Component {

  render() {
  return (
    <div className="Main">
      <TakePic />
    </div>
  );
  }
}

export default Main;
