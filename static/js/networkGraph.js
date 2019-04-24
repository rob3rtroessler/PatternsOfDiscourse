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

    // get correct color for each word
    console.log();
    // fill nodes
    for (key in tmpDistinctWords){
        let tmpObj= {
            "id": key,
            "label": key,
            "color": '#ff383f', // we're able to set individual colors!
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
            "to": key.split('To')[1],
            "value": tmpDict[key],
            "length": tmpDict[key]*10
        };
        edges.push(tmpObj);
    }

    console.log(edges);


    // create a network
    let container = document.getElementById('NetworkGraphDiv');

    // provide the data in the vis format
    let data = {
        nodes: nodes,
        edges: edges
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
