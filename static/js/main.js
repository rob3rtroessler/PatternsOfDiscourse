// declare function that gathers selected books
function gatherCorpusData () {
    let CorpusData = [];
    $('input[type=checkbox]:checked').each(function(){
        //console.log(this.id);
        CorpusData.push(this.id);
    });
    generateTexTile (CorpusData)
}

// declare a function that fires, when the 'generate' button is clicked
function generateTexTile(CorpusData) {
    console.log("The following TextIDs will be sent to the server:", CorpusData);
    axios.post('/corpus', {
        'selected texts' : CorpusData})
        .then(function (response) {

            console.log("The server sent:", response);    // log the response from server to examine data
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
        .then( TexTileDataWrangling(data) )    // the reason why we passed the 'promised' data from function to function
        .then( TexTileVis() )    // no need to pass unprocessed data, it will grab wrangled data from global variable
        .then( CreateProminentTileList (data.data.metadata.topwords)); // top words in the environment for the
    // searched word should be computed in python and passed into the JSON file's 'metadata'.
}


