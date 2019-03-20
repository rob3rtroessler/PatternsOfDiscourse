const express = require("express");
const path = require('path');
//const mysql = require('mysql');

// Initialize Express
const app = express();
app.use(express.static('static'));


app.get('/',function(req,res){
  res.sendFile(__dirname + '/index.html');
});

/*app.get('/',function(req,res){
    res.sendFile(__dirname + '/index.html');
});*/

app.get('/start',function(req,res){
    res.sendFile(__dirname + '/start.html');
});

// behavior for the comment section
app.post('/corpus', function (req, res) {
    console.log(req.body);
});



let port = process.env.PORT;

if (port == null || port == "") {
  port = 8000;
}
app.listen(port);

// log
console.log("Running on localhost:8000");
