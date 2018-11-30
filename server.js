const express = require('express');
const bodyParser = require("body-parser");
const path = require("path");
const shell = require('shelljs');
const datastore = require('nedb');
const app = express();
const dataStoreFile = "./data/detectorDataStore";
const db = new datastore(/*{ filename: dataStoreFile }*/);

//Helper Methods

//Update outData with new info from newData
function updateSingleDetectorData(newData, outData){
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
}

function updateDetectorsData(newDetectorsData, outData){
	//Update each detector
	const keyVals = Object.keys(outData);
	for(var keyI = 0; keyI < keyVals.length; keyI++){
		let key = keyVals[keyI];
		if(key in newDetectorsData){
			for(var i = 0; i < newDetectorsData[key].length; i++){
				updateSingleDetectorData(newDetectorsData[key][i], outData);
			}
		}
	}
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
	let newDetectorData = req["body"];

	//Add/Update detector info
	db.find({type: "bounding-box"}, (err, docs) => {
		if(err) throw err;
		var detectorObj;
		if(docs.length == 0){
			detectorObj = {type: "bounding-box", vehicle:[], pedestrian:[]};
		}else{
			detectorObj = docs[0];
		}
		updateDetectorsData(newDetectorData, detectorObj);
		db.update({type:"bounding-box"}, detectorObj, {upsert: true}, (err, numReplaces) => {
			if(err) throw err;
		});
	});

	res.send("Received");
});

//Responds with the detector bounding box data, used by the frontend
app.get('/detectorData', (req, res) => {
	//return detector data found in the database
	db.find({type: "bounding-box"}, (err, docs) => {
			if(err || docs.length == 0) res.send({'error':err, msg: "The database may have found no results"});
			else{
				res.send(docs[0]);
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
