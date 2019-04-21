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
    res.sendFile(__dirname + '/index.html');
});

// render grid.html
app.get('/grid',function(req,res){
    res.sendFile(__dirname + '/grid.html');
});

// getting corpus data;
app.post('/corpus', (request, response) => {
    console.log('received textIDs of selected texts from corpus:', request.body);

    // TODO: get text ids + associated bodies of text
    // stemitize take away roots + filler words -> lookup word, and (colocations) convert into nlp objects and create an
    // array of 7 words before and 7. catch all words from standard output and write to array
    // after every occurence of keyword
    // 30 most common words in collective word environments + store in metadata information in environments + occurence
    // count of those words + send back

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


let port = process.env.PORT;
if (port == null || port == "") {
    port = 8000;
}
app.listen(port);

console.log("TexTile is running");