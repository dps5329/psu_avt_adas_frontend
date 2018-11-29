
import React, { Component } from 'react';
//import Car from './car.png';
import DetectorWindow from './DetectorWindow.js';
import DetectorToggle from './DetectorToggle.js';

class App extends Component {
  render() {
    /*
          <div className = 'container'>
            <div className = "lane-left"/>
            <img src = {Car} className='car-logo'/>
            <div className = "lane-right"/>
          </div>
    */
    return (
      <div className="app">
            <DetectorWindow/>
            <DetectorToggle/>
      </div>
    );
  }
}

export default App;
