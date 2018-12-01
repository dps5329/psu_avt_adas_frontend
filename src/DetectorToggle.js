import React, { Component } from 'react';
import axios from 'axios';

class DetectorToggle extends Component{
  constructor(props){
    super(props);
    this.state = {
      detectorOn: false,
      disabled: false
    }
    this.clickHandler = this.clickHandler.bind(this);
  }

  clickHandler(){
    const buttonDisabled = this.state.disabled;
    if(!buttonDisabled){	  
	    const that = this;
	    const newDetectorState = !that.state.detectorOn;
	    //Disable button while processing
	    that.setState({disabled: true});		  
	    //If it was previously on then it should be turned off, vice versa
	    axios.post('/detector/toggle', {
	      detectorOn: newDetectorState
	    })
	    .then(function (response) {
	      console.log("received response from detector/toggle. DetectorOn: ");
	      console.log(newDetectorState);
	      that.setState({detectorOn: newDetectorState, disabled: false});
	    })
	    .catch(function (error) {
	      console.log(error);
	    });
    }
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
