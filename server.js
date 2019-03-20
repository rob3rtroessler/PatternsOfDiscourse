const express = require('express');
const util = require('util');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const port = 4000;

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


// listen on ${port}
app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }

    console.log(`server is listening on ${port}`)
});