import React, { Component } from 'react';
import axios from 'axios';

class DetectorToggle extends Component{
  constructor(props){
    super(props);
    this.state = {
      detectorOn: false
    }
    this.clickHandler = this.clickHandler.bind(this);
  }

  clickHandler(){
    const prevDetectorState = this.state.detectorOn;
    this.setState({detectorOn: !prevDetectorState});
    //If it was previously on then it should be turned off, vice versa
    /*axios.post('/detector/toggle', {
      detectorOn: !prevDetectorState
    })
    .then(function (response) {
      this.setState({detectorOn: !prevDetectorState});
    })
    .catch(function (error) {
      console.log(error);
    });*/
  }

  render(){
    //determine the detector class based on detectorOn state
    var detectorClass;
    var detectorText;
    if(this.state.detectorOn){
      detectorClass = "detector-on";
      detectorText = "Detectors Running (click to toggle)";
    }else{
      detectorClass = "detector-off";
      detectorText = "Detectors Off (click to toggle)";
    }
    return (
      <div className="detector-toggle" onClick={this.clickHandler}>
        <div className={detectorClass}>
          <p>{detectorText}</p>
        </div>
      </div>
    );
  }
}

export default DetectorToggle;
