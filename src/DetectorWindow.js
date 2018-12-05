import React, { Component } from 'react';
import axios from 'axios';

class DetectorWindow extends Component {
  constructor(props){
    super(props);
    this.state = {
        detectorData: {'vehicle': [], 'pedestrian': []},
        detectorScaleWidthRatio: 800/1920, //Used to scale the image size used for detection on TX2 down to raspberry pi touch display size
        detectorScaleHeightRatio: 480/1080
    };
    this.fetchDetectorData = this.fetchDetectorData.bind(this);
  }

  componentDidMount(){
    //Update the data every 10th of a second
    this.interval = setInterval(this.fetchDetectorData, 100);
  }

  componentWillUnmount(){
    clearInterval(this.interval);
  }

  //Request to get the detector data from the proxy server (defined in server.js file)
  fetchDetectorData(){
    axios.get('/detectorData').then(resp => {
      let data = resp['data'];
      if(data['error'] === true){
        console.log("ERROR");
        console.log(data);
      }else{
        this.setState({detectorData: data});
      }
    });
  }

  //Specifies the dimensions and position of the box
  calculateBoundingBoxStyle(box){
    const top = box['topLeftCoords'][1]*this.state.detectorScaleHeightRatio;
    const left = box['topLeftCoords'][0]*this.state.detectorScaleWidthRatio;
    const width = (box['bottomRightCoords'][0] - box['topLeftCoords'][0])*this.state.detectorScaleWidthRatio;
    const height = (box['bottomRightCoords'][1] - box['topLeftCoords'][1])*this.state.detectorScaleHeightRatio;
    return {
      top: top,
      left: left,
      width: width,
      height: height
    };
  }

  render() {
    //Create divs for the
    const DetectionBoxes = ({detectorData}) => (
      <>
        {detectorData['vehicle'].map(vehicleBox => (
          <div className="bounding-box vehicle-box" style={this.calculateBoundingBoxStyle(vehicleBox)}>
            <p>Vehicle</p>
          </div>
        ))}
        {detectorData['pedestrian'].map(pedBox => (
          <div className="bounding-box ped-box" style={this.calculateBoundingBoxStyle(pedBox)}>
            <p>Ped</p>
          </div>
        ))}
      </>
    );
    return (
      <div className="detector-window">
          <DetectionBoxes detectorData={this.state.detectorData}/>
      </div>
    );
  }
}

export default DetectorWindow;
