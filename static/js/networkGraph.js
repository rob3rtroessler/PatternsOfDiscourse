// wrangle data

let nodes = [];
let edges = [];

function wrangleNetworkData () {


    let tmpDistinctWords = {};

    // create dict with all unique words plus the # of occurences
    WrangledTexTileData.forEach(
        environment => {
            environment.forEach(
                word => {
                    if ( word in tmpDistinctWords ){
                        tmpDistinctWords[word] += 1;
                    }
                    else {
                        tmpDistinctWords[word] = 0;
                    }
                }
            )
        }
    );

    console.log(tmpDistinctWords);

    // reset nodes
    nodes = [];
    let id = 0;

    // fill nodes
    for (key in tmpDistinctWords){
        let tmpObj= {
            "id": key,
            "label": key,
            "value": tmpDistinctWords[key]
        };
        nodes.push(tmpObj);
        id += 1;
    }

    console.log(nodes);


    // create edges
    tmpDict = {};
    edges = [];
    let count = 0;

    WrangledTexTileData.forEach(
        environment => {
            console.log('lets start', environment);
            environment.forEach(
                (word, i) => {

                    // take that word.. then combine it with all other words from that environment
                    for (j = i + 1; j < environment.length ; j++){
                        //console.log(i, word, environment[j]);

                        // create new key with edge info
                        let tmpKey = word + 'To' + environment[j];
                        let tmpKeyReverse = environment[j] + 'To' + word;

                        // if tmpKey exists, or else if it exists 'reversed' + 1,
                        if ( tmpKey in tmpDict){
                            tmpDict[tmpKey] += 1;
                        }
                        else if(tmpKeyReverse in tmpDict){
                            tmpDict[tmpKeyReverse] += 1;
                        }
                        // else create new key and initiate with 1
                        else {
                            tmpDict[tmpKey] = 1;
                            count += 1;
                        }
                    }

                }
            )
        }
    );

    // have a look at the current edge info
    console.log (count, tmpDict);

    // fill edges
    for (key in tmpDict){
        let tmpObj= {
            "from": key.split('To')[0],
            "to": key.split('To')[1]
            //"value": tmpDict[key]
        };
        edges.push(tmpObj);
    }

    console.log(edges);


    // create an array with edges
/*    var edges = new vis.DataSet([
        {from: 1, to: 3},
        {from: 1, to: 2},
        {from: 2, to: 4},
        {from: 2, to: 5}
    ]);*/

    // create a network
    var container = document.getElementById('NetworkGraphDiv');

    // provide the data in the vis format
    var data = {
        nodes: nodes,
        edges: edges
    };
    var options = {};

    // initialize your network!
    var network = new vis.Network(container, data, options);
}




// putting everything inside a function so that multiple examples can be visualized
function DrawNetwork(){

// create an array with nodes
    authors = new vis.DataSet(ServerData.authors);

// create an array with edges
    correspondences = new vis.DataSet(CorrespondenceArray);

// create a network
    let container = document.getElementById('NetworkGraphDiv');

// provide the data in the vis format
    let data = {
        nodes: authors,
        edges: correspondences
    };

    let options = {

        // edges
        edges: {
            color: {
                color: '#000000',
                highlight: 'rgba(143, 43, 43, 0.81)',
                hover: 'rgba(143, 43, 43, 0.81)'
            },
            scaling: {
                min: 1,
                max: 10
            }
        },

        // nodes
        nodes:{
            brokenImage:'img/YV/Author_0.jpg',
            color: {
                border: '#000000',
                hover: 'rgba(143, 43, 43, 0.81)',
                highlight: 'rgba(143, 43, 43, 0.81)'
            },
            image: '',
            shape: 'circularImage',
            shapeProperties: {
                borderDashes: false, // only for borders
                borderRadius: 6,     // only for box shape
                interpolation: false,  // only for image and circularImage shapes
                useImageSize: false,  // only for image and circularImage shapes
                useBorderWithImage: false  // only for image shape
            }
        },
        // interaction
        interaction: {
            hover: true,
            hoverConnectedEdges: true,
        }
    };

    // initialize your network!
    network = new vis.Network(container, data, options);


// FUNCTIONALITY FOR NODE CLICKED
    network.on("selectNode", function(d){

        // log
        console.log('a node was clicked, following info is accessible:', d);

        // store selectedNodes
        let selectedNodes = network.getSelectedNodes();

        // if one and only one node is selected then update and show NodeInfo(author) on the left side
        if(selectedNodes.length === 1){

            // store authorID
            selectedAuthorID = selectedNodes;

            // calling NodeClicked:
            NodeClicked(selectedAuthorID);

        }
    });

// FUNCTIONALITY FOR EDGE CLICKED
    network.on("click", function(d){

        // store selectedEdges
        let selectedEdges = network.getSelectedEdges();

        // if one and only one edge is selected then update and show EdgeInfo(correspondence) on the right side
        if(selectedEdges.length === 1){

            // get connected authorIDs by use of edgeID
            selectedSenderID =  correspondences._data[selectedEdges].from;
            selectedRecipientID = correspondences._data[selectedEdges].to;
            console.log ('an edge was clicked, connecting Authors:', selectedSenderID, '&' , selectedRecipientID);
            EdgeClicked(selectedSenderID, selectedRecipientID);
        }
    });
}
