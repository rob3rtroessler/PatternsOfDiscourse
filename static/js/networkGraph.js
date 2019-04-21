// wrangle data


// TODO: loop through all arrays and create nodes. then create edges
function wrangleNetworkData () {
    console.log('test');
    console.log('network running never', WrangledTexTileData);
}
// nodes: jedes unique word



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
