
import React, { Component } from 'react';
import Car from './car.png';
import DetectorWindow from './DetectorWindow.js';

class App extends Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      <div className="app">
            <div className = 'container'>
              <div className = "lane-left"/>
              <img src = {Car} className='car-logo'/>
              <div className = "lane-right"/>
            </div>
            <DetectorWindow/>
       </div>
    );
  }
}

export default App;
