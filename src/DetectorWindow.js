import React, { Component } from 'react';
import axios from 'axios';

class DetectorWindow extends Component {
  constructor(props){
    super(props);
    this.state = {
        detectorData: {'vehicle': [], 'pedestrian': []}
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
      if('error' in resp){
        console.log("ERROR");
        console.log(resp['error']);
      }else{
        this.setState({detectorData: resp.data});
      }
    });
  }

  calculateBoundingBoxStyle(box){
    const width = box['bottomRightCoords'][0] - box['topLeftCoords'][0];
    const height = box['bottomRightCoords'][1] - box['topLeftCoords'][1];
    const top = box['topLeftCoords'][1];
    const left = box['topLeftCoords'][0];
    return {
      width: width,
      height: height,
      marginTop: top,
      marginLeft: left
    };
  }

  render() {
    const DetectionBoxes = ({detectorData}) => (
      <>
        {detectorData['vehicle'].map(vehicleBox => (
          <div className="bounding-box-wrap">
            <p>Vehicle</p>
            <div className="bounding-box" style={this.calculateBoundingBoxStyle(vehicleBox)}/>
          </div>
        ))}
        {detectorData['pedestrian'].map(pedBox => (
          <div className="bounding-box-wrap">
            <p>Pedestrian</p>
            <div className="bounding-box" style={this.calculateBoundingBoxStyle(pedBox)}/>
          </div>
        ))}
      </>
    );
    return (
      <div className="detector-window">
        <div className="vehicle-box">
          <DetectionBoxes detectorData={this.state.detectorData}/>
        </div>
      </div>
    );
  }
}

export default DetectorWindow;
