const express = require('express');
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const shell = require('shelljs');
const app = express();
const dataStoreFile = "./data/detector.json";

//Helper Methods
function updateDetectorData(newData, outData){
	let boxID = newData["id"];
	let type = newData["type"];
	//check if the data shoyld be reset
	if(boxID == 0){
		outData[type] = [];
		outData[type].push(newData);

	}else{
		if(outData[type].length <= boxID){
			outData[type].push(newData);
		}else{
			outData[type][boxID] = newData;
		}
	}
	return outData;
}

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'build')));

//Endpoints
app.get('/ping', function (req, res) {
 return res.send('pong');
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

//Endpoint to update detector bounding box info, used by the TX2
app.post('/', function(req, res){
	console.log(req.body);
	let newDetectorData = req["body"];

	//Check if output file exists, create if it doesn't
	if(!fs.existsSync(dataStoreFile)){
		let baseDetectorObj = {"vehicle":[], "pedestrian":[]};
		fs.writeFile(dataStoreFile, JSON.stringify(baseDetectorObj), function (err){
			if(err) throw err;
			console.log(dataStoreFile + " created successfully");
		});
	}

	var detectorData;
	fs.readFile(dataStoreFile, (err, data) => {
		if(err) throw err;
		console.log("Read: "+data);
		detectorData = JSON.parse(data);
		//update and write the new data
		detectorData = updateDetectorData(newDetectorData, detectorData);
		let writeData = JSON.stringify(detectorData, null, 2); //pretty print
		//Delete the file and write new data
		shell.exec('rm '+dataStoreFile);
		fs.writeFile(dataStoreFile, writeData, (err) => {
			if(err) throw err;
			console.log("wrote data to "+dataStoreFile+":\n"+writeData);
		});
	});

	res.send("Received");
});

//Responds with the detector bounding box data, used by the frontend
app.get('/detectorData', (req, res) => {
	fs.readFile(dataStoreFile, (err, data) =>{
			if(err) res.send({'error':err});
			else{
				res.send(data);
			}
	});
});

//Starts or stops the detectnet-program on the TX2
app.post('/detector/toggle', function(req, res){
	console.log(req);
	const turnDetectorOn = req['body']['detectorOn'];
	if(turnDetectorOn){
		//Run script to turn on detector
		shell.exec('./scripts/start_tx2.sh');
	}else{
		//Run script to turn on detector
		shell.exec('./scripts/stop_tx2.sh');
	}
	res.send({success: true});
});



//Run app on port
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
