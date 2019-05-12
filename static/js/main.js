// DECLARE GLOBAL VARIABLES
let nodes = [];
let edges = [];
let chordData = [];


// declare function that gathers selected books
function gatherCorpusData () {
    let CorpusData = {};
    let tmpIDs = [];
    // get all ids of selected texts from the corpus
    $('input[type=checkbox]:checked').each(function(){
        //console.log(this.id);
        tmpIDs.push(this.id);
    });

    // prepare JSON data that will be sent to server
    CorpusData = {
        keyword: document.getElementById('TexTileWordInput').value,
        selectedIDs: tmpIDs
    };

    // check correct input
    if (CorpusData.keyword === "" || CorpusData.selectedIDs.length === 0){
        alert('Please provide a Keyword and select at least one text from the corpus!');
    }
    else {
        generateTexTiles(CorpusData)
    }
}

// declare a function that fires, when the 'generate' button is clicked
function generateTexTiles(CorpusData) {
    console.log("---------------------------------------------- \n " +
        "The following TextIDs will be sent to the server:", CorpusData);
    axios.post('/corpus', {
        'selected texts' : CorpusData})
        .then(function (response) {

            console.log("The server sent back:", response);    // log the response from server to examine data
            initTexTileModule(response);    // call async initializer function
        })
        .catch(function (error) {
            console.log(error)
        });
}

// declare async initialize function to keep all processes in order
async function initializeTexTileModule (data){
}

// declare function that is triggered when server response received
function initTexTileModule(data){

    // call async function
    initializeTexTileModule(data)
        .then( wrangleTexTileData(data) )    // the reason why we passed the 'promised' data from function to function
        .then( wrangleLineChartData(lockedWords, data) )    // lineChart data should take info from lockedWords from
    // searched word should be computed in python and passed into the JSON file's 'metadata'.
        .then( wrangleNetworkData() )
        .then( wrangleMatrixData() )
}



