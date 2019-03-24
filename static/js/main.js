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

// declare function that creats list with prominent tiles
function CreateProminentTileList (data) {
    console.log(data);
    data.forEach( (d,i) => {
        // console.log(d,i);
        if (0 <= i && i < 10){
            document.getElementById('top10').innerHTML += '<div class="row listItem" style="border: thin solid' +
                ' lightgrey">' + d + '</div>'
        }
        else if (10 <= i && i < 20){
            document.getElementById('top20').innerHTML += '<div class="row listItem" style="border: thin solid' +
                ' lightgrey">' + d + '</div>'
        }
        else if (20 <= i && i < 30){
            document.getElementById('top30').innerHTML += '<div class="row listItem" style="border: thin solid' +
                ' lightgrey">' + d + '</div>'
        }
    })

}

let colors = ['#8dd3c7','#ffffb3','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9','#bc80bd'];

colors.forEach((d)=> {
    document.getElementById('colorScale').innerHTML += `<div class="row listItem" style="background-color:` + d + `"></div>`

});