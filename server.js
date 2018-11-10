const express = require('express');
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

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

app.post('/', function(req, res){
  console.log(req.body);
  res.send("Received");
});

//Run app on port
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
