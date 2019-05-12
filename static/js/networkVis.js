
// wrangle data
function wrangleNetworkData () {

    // reset nodes & edges
    nodes = [];
    edges = [];
    chordData = [];
    let tmpDistinctWordDict = {};

    // create dict with all unique words plus the # of occurences
    WrangledTexTileData.forEach(
        environment => {
            environment.forEach(
                word => {
                    if ( word in tmpDistinctWordDict ){
                        tmpDistinctWordDict[word] += 1;
                    }
                    else {
                        tmpDistinctWordDict[word] = 1;
                    }
                }
            )
        }
    );


    // sort tmpDistinctWords
    let tmpDistinctWordDict_sorted = [];

    // convert tmpDistinctWordDict into sortable object
    Object.keys(tmpDistinctWordDict).forEach( d => {
        let tmpObj= {
            "word": d,
            "value": tmpDistinctWordDict[d]
        };
        tmpDistinctWordDict_sorted.push(tmpObj);
    });

    // sort
    tmpDistinctWordDict_sorted.sort(function (a, b) {return b.value - a.value});

    console.log('data for TileLists:',  tmpDistinctWordDict_sorted);
    // having created a distinctWordDict_sorted, we can createDistinctTileList_TabOne and _TabTwo
    createDistinctTileList_TabOne(tmpDistinctWordDict_sorted);
    createDistinctTileList_TabTwo(tmpDistinctWordDict_sorted);

    // reset nodes
    nodes = [];
    let id = 0;

    // fill nodes
    for (key in tmpDistinctWordDict){
        // TODO: if key === keyword, drop it. else, move on!
        // TODO: build switch that allows to: 1) show all, 2) show only those, that are connected, 3) show only sel

        // prepare data for network graph
        let tmpObj= {
            "id": key,
            "label": key,
            "color": '#ffffff', // we're able to set individual colors!
            "value": tmpDistinctWordDict[key]
        };
        nodes.push(tmpObj);
        id += 1;
    }


    /************************************
     *                                  *
     *   data for EDGES and CHORDS      *
     *                                  *
     ***********************************/
    tmpDict = {};
    edges = [];
    let count = 0;

    WrangledTexTileData.forEach(
        environment => {
            // TODO: implement switch: if environment.includes()
            // TODO: let found = environment.some(d=> lockedWords.includes(d))
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

    // fill edges
    for (key in tmpDict){

        // fill tmpObj for network graph
        let tmpObj= {
            "from": key.split('To')[0],
            "to": key.split('To')[1],
            "value": tmpDict[key],
            "length": tmpDict[key]*10
        };
        edges.push(tmpObj);

        // fill obj for chord graph
        chordData.push([key.split('To')[0],key.split('To')[1],tmpDict[key]],[key.split('To')[1],key.split('To')[0],tmpDict[key]]);
    }


    /***********************************
    *      DATA WRANGLING DONE         *
    * call chordGraph and networkGraph *
    *                                  *
    ***********************************/
    drawChordGraph(chordData, tmpDistinctWordDict);
    drawNetworkGraph(nodes, edges);
}





function drawNetworkGraph(nodes, edges){

    // create a network
    let container = document.getElementById('NetworkGraphDiv');

    // provide the data in the vis format
    let data = {
        nodes: nodes,
        edges: edges
    };
    console.log('data for NetworkGraph:', data);

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
            color: {
                border: '#000000',
                hover: 'rgba(143, 43, 43, 0.81)',
                highlight: 'rgba(143, 43, 43, 0.81)'
            },
            scaling: {
                min: 1,
                max: 20
            },
            shape: 'box',
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
        },
        physics:{
            enabled: true,
            barnesHut: {
                gravitationalConstant: -2000,
                centralGravity: 0.3,
                springLength: 95,
                springConstant: 0.04,
                damping: 0.09,
                avoidOverlap: 0
            },
            forceAtlas2Based: {
                gravitationalConstant: -50,
                centralGravity: 0.1,
                springConstant: 0.08,
                springLength: 100,
                damping: 0.4,
                avoidOverlap: 0
            },
            repulsion: {
                centralGravity: 0.2,
                springLength: 200,
                springConstant: 0.05,
                nodeDistance: 100,
                damping: 0.09
            },
            hierarchicalRepulsion: {
                centralGravity: 0.0,
                springLength: 100,
                springConstant: 0.01,
                nodeDistance: 120,
                damping: 0.09
            },
            maxVelocity: 50,
            minVelocity: 0.1,
            solver: 'forceAtlas2Based',
            stabilization: {
                enabled: true,
                iterations: 5,
                updateInterval: 100,
                onlyDynamicEdges: false,
                fit: true
            },
            timestep: 0.5,
            adaptiveTimestep: true
        }
    };

    // initialize your network!
    let network = new vis.Network(container, data, options);

    // effects:
    network.on("selectNode", function(d){
        console.log('node selected')
    });
}
