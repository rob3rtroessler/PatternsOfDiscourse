const express = require('express');
const util = require('util');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();

const path = require('path');

// setting up path for static scripts
app.use(express.static('static'));

// setting up bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// render index.html
app.get('/',function(req,res){
    res.sendFile(__dirname + '/start.html');
});

// getting corpus data;
app.post('/corpus', (request, response) => {
    console.log(request.body)
});


let port = process.env.PORT;
if (port == null || port == "") {
    port = 8000;
}
app.listen(port);

console.log("Running on heroku");