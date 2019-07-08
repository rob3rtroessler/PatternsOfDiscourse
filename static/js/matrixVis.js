// global variables
let matrixData = [];
let matrixLockedWords = [];

function fillMatrixLockedWordsArray (TileName){

    // change color and mark that word is selected
    let MatrixTileIdName = 'M-'+ TileName;

    if (!$("#" + MatrixTileIdName).hasClass('M-selected')){

        // add word to array & color the tile
        matrixLockedWords.push(TileName);
        $("#" + MatrixTileIdName).addClass('M-selected');

    }
    else {
        $("#" + MatrixTileIdName).removeClass('M-selected');
        matrixLockedWords.forEach(function(d,i){
            console.log('doing it for all', d, i,MatrixTileIdName);
            if (d === MatrixTileIdName.split('-')[1]){
                delete matrixLockedWords[i];
            }
        });
    }

    console.log(matrixLockedWords);
}

// initiate matrix through APPLY-BTN
document.getElementById('initiateMatrixButton').addEventListener('click', initiateMatrix);

// initiate Matrix
function initiateMatrix () {

    // whenever we initiate a matrix, we delete the old one
    $("#matrixSVG").html(' ');

    // get ids for data sets 1 & 2
    // TODO: get input from checkboxes - for the paper a hard-coded version will do
    let textIdArrayForMatrixDataSetOne = [0,5,6];
    let textIdArrayForMatrixDataSetTwo = [9];

    // calculate data for data sets 1&2
    let matrixDataSetOne = wrangleMatrixData(textIdArrayForMatrixDataSetOne),
        matrixDataSetTwo = wrangleMatrixData(textIdArrayForMatrixDataSetTwo);

    // console.log(matrixDataSetOne, matrixDataSetTwo);

    let matrixDataSetOneFinal = finalizeMatrixData(matrixDataSetOne),
        matrixDataSetTwoFinal = finalizeMatrixData(matrixDataSetTwo);

    // console.log(matrixDataSetOneFinal, matrixDataSetTwoFinal);

    drawMatrixVis(matrixDataSetOneFinal,matrixDataSetTwoFinal)
}


// wrangle data for the Matrix View
function wrangleMatrixData (textIdArray) {

    // tmp
    let tmpArrayWithRelevantEnvironments = [];

    // first, create the array data structure by filtering with the usage of textIdArray
    rawData.data.data.forEach( function (d){
        if ( textIdArray.includes(d.textID) ) {
            d.environments.forEach(function(d){
                tmpArrayWithRelevantEnvironments.push(d);
            })
        }
    });

    // TODO: pick current nodes! i.e. lockedWords -> new lockedWords!

    // calculate nodes
    nodes = [];
    let id = 0;

    // fill nodes
    for (key in tmpDistinctWordDict){

        if (matrixLockedWords.includes(key)){

            // prepare data for network graph
            let tmpObj= {
                "id": key,
                "label": key,
                "color": lookUpColor(key), // we're able to set individual colors!
                "value": tmpDistinctWordDict[key]
            };
            nodes.push(tmpObj);
            id += 1;
        }
    }

    console.log('check nodes:',nodes);

    // calculate edges
    tmpDict = {};
    edges = [];
    let count = 0;

    tmpArrayWithRelevantEnvironments.forEach(
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
    for (key in tmpDict) {

        if (matrixLockedWords.includes(key.split('To')[0]) && matrixLockedWords.includes(key.split('To')[1])  && ( key.split('To')[0] !== key.split('To')[1] )) {

            console.log('test', key.split('To')[0], key.split('To')[1], lockedWords);
            let tmpObj = {
                "from": key.split('To')[0],
                "to": key.split('To')[1],
                "value": tmpDict[key],
                "length": 300 / tmpDict[key]
            };
            edges.push(tmpObj);
        }
    }


    // then do nodes and edges for dataset 1 then for 2 (like in network graph!)
    let data = {
        nodes: nodes,
        edges: edges
    };

    return data;
}


// TODO - combine with wrangleMatrixData
function finalizeMatrixData(data) {

    nodes = data.nodes;
    edges = data.edges;

    // lookup array
    let lookup = {};

    // prepare matrixNodes
    let matrixNodes = [];
    nodes.forEach((node, i) => {

        // fill the lookup array
        lookup[node.label] = i;

        // create matrix specific node object
        let tmpMatrixNode = {
            group: 1,
            index: i,
            name: node.label,
            count: node.value
        };
        matrixNodes.push(tmpMatrixNode);

    });


    // prepare matrixEdges
    let matrixEdges = [];
    edges.forEach(edge => {
        // console.log(edge)
        // TODO: use nodes to lookup the correct
        let tmpMatrixLink = {
            source: lookup[edge.from],
            target: lookup[edge.to],
            value: edge.value
        };
        matrixEdges.push(tmpMatrixLink)
    });

    // finalize matrixData
    matrixData = {
        nodes: matrixNodes,
        links: matrixEdges
    };

    // log data
    console.log('data for MatrixVis:', matrixData);

    // return data
    return matrixData
}


// draw Matrix
function drawMatrixVis(data, dataTwo) {

    // define dimensions and margins
    let matrixMargin = { top: 80, right: 105, bottom: 130, left: 105 },
        matrixWidth = $("#matrixSVG").width() - matrixMargin.left - matrixMargin.right,
        matrixHeight =$("#matrixSVG").width() - matrixMargin.top - matrixMargin.bottom;

    // apply margin conventions
    let matrixSvg = d3.select("#matrixSVG").append("svg")
        .attr("width", matrixWidth + matrixMargin.left + matrixMargin.right)
        .attr("height", matrixHeight + matrixMargin.top + matrixMargin.bottom)
        .append("g")
        .attr("transform", "translate(" + matrixMargin.left + "," + matrixMargin.top + ")");

    // background
    matrixSvg.append("rect")
        .attr("class", "background")
        .attr("width", matrixWidth)
        .attr("height", matrixHeight);


    // prepare matrix D1
    let matrix = [];
    let matrixNodes = data.nodes;
    let total_items = matrixNodes.length;

    // prepare matrix D2
    let matrix_D2 = [];
    let matrixNodes_D2 = dataTwo.nodes;
    let total_items_D2 = matrixNodes_D2.length;

    // scales
    let matrixScale = d3.scaleBand().range([0, matrixWidth]).domain(d3.range(total_items));
    let opacityScale = d3.scaleLinear().domain([0, 10]).range([0.3, 1.0]).clamp(true);
    let colorScale = d3.scaleOrdinal(d3.schemeCategory10);
    let colorScaleTwo = d3.scaleOrdinal(['#2ca02c']);

    // color scales
    let colors_D1 = ['#fee5d9','#fcbba1','#fc9272','#fb6a4a','#de2d26','#a50f15'];
    let colors_D2 = ['#eff3ff','#c6dbef','#9ecae1','#6baed6','#3182bd','#08519c'];

    let colorScaleD1 = d3.scaleThreshold()
        .domain([0,1,2,4,8,15])
        .range(colors_D1);
    let colorScaleD2 = d3.scaleThreshold()
        .domain([0,1,2,4,8,15])
        .range(colors_D2);


    // Create rows for the matrix D1
    matrixNodes.forEach(function(node) {
        node.count = 0;
        matrix[node.index] = d3.range(total_items).map(item_index => {
            return {
                x: item_index,
                y: node.index,
                z: 0
            };
        });
    });


    // Fill matrix with data from links and count how many times each item appears D1
    data.links.forEach(function(link) {
        matrix[link.source][link.target].z += link.value;
        matrix[link.target][link.source].z += link.value;
        matrixNodes[link.source].count += link.value;
        matrixNodes[link.target].count += link.value;
    });


    // Create rows for the matrix D2
    matrixNodes_D2.forEach(function(node) {
        node.count = 0;
        matrix_D2[node.index] = d3.range(total_items).map(item_index => {
            return {
                x: item_index,
                y: node.index,
                z: 0
            };
        });
    });

    // Fill matrix with data from links and count how many times each item appears D2
    dataTwo.links.forEach(function(link) {
        matrix_D2[link.source][link.target].z += link.value;
        matrix_D2[link.target][link.source].z += link.value;
        matrixNodes_D2[link.source].count += link.value;
        matrixNodes_D2[link.target].count += link.value;
    });

    console.log('matrix here', matrix);

    // Draw each row (translating the y coordinate)
    let rows = matrixSvg.selectAll(".row")
        .data(matrix)
        .enter().append("g")
        .attr("class", "row")
        .attr("transform", (d, i) => {
            return "translate(0," + matrixScale(i) + ")";
        });

    let squaresOne = rows.selectAll(".cell")
        .data(d => d.filter(item => item.z > 0))
        .enter()
        /* alternative: small rect
        .append("rect")
        .attr("class", "cell")
        .attr("x", function(d){ return matrixScale(d.x) })
        .attr("width", matrixScale.bandwidth())
        .attr("height", matrixScale.bandwidth()/2)
        */

        // polygons
        .append("polygon")
        .attr("class", "cell")
        .attr('points', function(d){return (
            matrixScale(d.x) + ',0 ' +
            (matrixScale(d.x)+ matrixScale.bandwidth()) + ',0 ' +
            (matrixScale(d.x)+ matrixScale.bandwidth()) + ',' + matrixScale.bandwidth() )})
/*        .style("fill-opacity", d => opacityScale(d.z)).style("fill", d => {
            return matrixNodes[d.x].group === matrixNodes[d.y].group ? colorScale(matrixNodes[d.x].group) : "grey";
        })*/
        .attr('fill', function (d){return colorScaleD1(d.z)})
        .on("mouseover", mouseover)
        .on("mouseout", mouseout);


    // Draw each row (translating the y coordinate)
    let rowsTwo = matrixSvg.selectAll(".rowTwo")
        .data(matrix_D2)
        .enter().append("g")
        .attr("class", "rowTwo")
        .attr("transform", (d, i) => {
            return "translate(0," + matrixScale(i) + ")";
        });
    let squaresTwo = rowsTwo.selectAll(".cell-D-2")
        .data(d => d.filter(item => item.z > 0))
        .enter()
        /* alternative: small rect
        .append("rect")
        .attr("class", "cell-D-2")
        .attr("x", function(d){ return matrixScale(d.x) })
        .attr("transform", "translate(0," + matrixScale.bandwidth()/2 + ")")
        .attr("width", matrixScale.bandwidth())
        .attr("height", matrixScale.bandwidth()/2)
        */
        .append("polygon")
        .attr("class", "cell-D-2")
        .attr('points', function(d){return (
            matrixScale(d.x) + ',0 ' +
            matrixScale(d.x) + ',' + matrixScale.bandwidth() + ' ' +
            (matrixScale(d.x)+ matrixScale.bandwidth()) + ',' + matrixScale.bandwidth() )})
/*        .style("fill-opacity", d => opacityScale(d.z)).style("fill", d => {
            return matrixNodes[d.x].group === matrixNodes[d.y].group ? colorScaleTwo(matrixNodes[d.x].group) : "grey";
        })*/
        .attr('fill', function (d){return colorScaleD2(d.z)})
        .on("mouseover", mouseover)
        .on("mouseout", mouseout);


    let columns = matrixSvg.selectAll(".column")
        .data(matrix)
        .enter().append("g")
        .attr("class", "column")
        .attr("transform", (d, i) => {
            return "translate(" + matrixScale(i) + ")rotate(-90)";
        });

    // add horizontal labels
    rows.append("text")
        .attr("class", "label")
        .attr("x", -5)
        .attr("y", matrixScale.bandwidth() / 2)
        .attr("dy", ".32em")
        .attr("text-anchor", "end")
        .text((d, i) => matrixNodes[i].name);

    // add vertical labels
    columns.append("text")
        .attr("class", "label")
        .attr("y", 100)
        .attr("y", matrixScale.bandwidth() / 2)
        .attr("dy", ".32em")
        .attr("text-anchor", "start")
        .text((d, i) => matrixNodes[i].name);

    // draw grid
    rows.append("line")
        .attr("x2", matrixWidth);
    columns.append("line")
        .attr("x1", -matrixWidth);

    let tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip_matrix")
        .style("opacity", 0);

    // Precompute the orders
    let orders = {
        name: d3.range(total_items).sort((a, b) => {
            return d3.ascending(matrixNodes[a].name, matrixNodes[b].name);
        }),
        count: d3.range(total_items).sort((a, b) => {
            return matrixNodes[b].count - matrixNodes[a].count;
        }),
        group: d3.range(total_items).sort((a, b) => {
            return matrixNodes[b].group - matrixNodes[a].group;
        })
    };
    d3.select("#matrixReorder").on("change", function() {
        changeOrder(this.value);
    });


    // define function to reorder the matrix
    function changeOrder(value) {
        matrixScale.domain(orders[value]);
        let t = matrixSvg.transition().duration(2000);

        // first set
        t.selectAll(".row")
            .delay((d, i) => matrixScale(i) * 4)
            .attr("transform", function(d, i) {
                return "translate(0," + matrixScale(i) + ")";
            })
            .selectAll(".cell")
            .delay(d => matrixScale(d.x) * 4)
            //.attr("x", d => matrixScale(d.x));
            .attr('points', function(d){return (
                matrixScale(d.x) + ',0 ' +
                (matrixScale(d.x)+ matrixScale.bandwidth()) + ',0 ' +
                (matrixScale(d.x)+ matrixScale.bandwidth()) + ',' + matrixScale.bandwidth() )});

        // second set
        t.selectAll(".rowTwo")
            .delay((d, i) => matrixScale(i) * 4)
            .attr("transform", function(d, i) {
                return "translate(0," + matrixScale(i) + ")";
            })
            .selectAll(".cell-D-2")
            .delay(d => matrixScale(d.x) * 4)
            .attr('points', function(d){return (
                matrixScale(d.x) + ',0 ' +
                matrixScale(d.x) + ',' + matrixScale.bandwidth() + ' ' +
                (matrixScale(d.x)+ matrixScale.bandwidth()) + ',' + matrixScale.bandwidth() )});

        t.selectAll(".column")
            .delay((d, i) => matrixScale(i) * 4)
            .attr("transform", (d, i) => "translate(" + matrixScale(i) + ")rotate(-90)");
    }

    function mouseover(p) {
        d3.selectAll(".row text").classed("active", (d, i) => {
            return i === p.y;
        });
        d3.selectAll(".column text").classed("active", (d, i) => {
            return i === p.x;
        });
        tooltip.transition().duration(200).style("opacity", .9);
        tooltip.html(matrixNodes[p.y].name + "</br>" +
            matrixNodes[p.x].name + "</br>" +
            p.z + " cooccurences")
            .style("left", (d3.event.pageX + 30) + "px")
            .style("top", (d3.event.pageY - 50) + "px");
    }

    function mouseout() {
        d3.selectAll("text").classed("active", false);
        tooltip.transition().duration(500).style("opacity", 0);
    }

}
