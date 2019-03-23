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

// render grid.html
app.get('/grid',function(req,res){
    res.sendFile(__dirname + '/grid.html');
});

// getting corpus data;
app.post('/corpus', (request, response) => {
    console.log('received textIDs of selected texts from corpus:', request.body);

    // python action here!!
    console.log('spawning child - run async python script using argv[1] for textIDs? - store everything in JSON');

    // read relevant JSON file and send that data to the client
    fs.readFile(__dirname + '/JSON/example_2.json', function(err, data){
        // response.write(content) also works
        response.send(data);

        console.log('sent JSON data to server');
        response.end();
    });

});

/*

let {PythonShell} = require('python-shell');

let pyshell = new PythonShell('scrispt.py');


*/




let port = process.env.PORT;
if (port == null || port == "") {
    port = 8000;
}
app.listen(port);

console.log("DiscourVis is running");