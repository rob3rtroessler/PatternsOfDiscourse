let margin = {top: 150, right: 0, bottom: 10, left: 150},
    width = $("#FabricVisContainer").width(),
    height = width,
    graph = {"nodes" : [], "links" : [] };

let x = d3.scale.ordinal().rangeBands([0, width]);
let xBoundaryLines = d3.scale.linear();
let yBoundaryLines = d3.scale.linear();
let z = d3.scale.linear().domain([0, 4]).clamp(true);
let c = d3.scale.category10().domain(d3.range(10));

let svg = d3.select("#matrixSVG").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("margin-left", -margin.left + "px")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//data source variables
var public_spreadsheet_url = 'https://docs.google.com/spreadsheets/d/1W-4VOXz4VBYIthILhiMmVm21fvkb3I03cfhdfyiPQIY/pubhtml',
    linksData,
    nodesData;
var loadedLinks = false;
var loadedNodes = false;
var matrix = [];


function getNodeData() {
    nodesData = Tabletop.init( 	{ 	key: public_spreadsheet_url,
        wanted: ["nodes-lisa"],
        callback: processNodesData,
        simpleSheet: true
    } );
}

function getLinkData() {
    linksData = Tabletop.init( 	{ 	key: public_spreadsheet_url,
        wanted: ["links-lisa"],
        callback: processLinksData,
        simpleSheet: true
    } );
}

//process the data from Google Sheets into format for D3 graphs
function processNodesData(data) {
    var i;
    for(i = 0; i < data.length; i++) {
        if (data[i]["weight"] == 0 ) {

            //do nothing
        } else {
            graph.nodes.push({ "name": data[i]["name"], "group": data[i]["group"], "distancetocentre": 1, "centre": false, "fixed": false });
        };

    };
    loadedNodes = true;
    drawGraphIfComplete();
}

function processLinksData(data) {
    var i;
    for(i = 0; i < data.length; i++) {
        graph.links.push({ "source": data[i]["source"], "target": data[i]["target"], "distance": +data[i]["value"] });

        for(var j = 0; j < graph.nodes.length; j++) {
            if (graph.links[i].source === graph.nodes[j].name) {
                graph.links[i].source = j;
            }
            if (graph.links[i].target === graph.nodes[j].name) {
                graph.links[i].target = j;
            }
        }
    };

    loadedLinks = true;
    drawGraphIfComplete();
}

function drawGraphIfComplete() {
    console.log(loadedNodes + " " + loadedLinks);
    if (loadedNodes && loadedLinks) {
        console.log("complete");
        drawGraph();
    };
}

function drawGraph() {

    var matrix = [];
    var nodes = graph.nodes;
    var n = nodes.length;
    var boundaryLines = [];

    xBoundaryLines.domain([0,n]);
    xBoundaryLines.range([0,width]);
    yBoundaryLines.domain([0,n]);
    yBoundaryLines.range([0,width]);

    // Compute index per node.
    nodes.forEach(function(node, i) {
        node.index = i;
        node.count = 0;
        matrix[i] = d3.range(n).map(function(j) { return {x: j, y: i, z: 0}; });
    });

    //fill the drop down menu with names, in alphabetical order

    var select = d3.select("select");
    var selectValues = [];
    graph.nodes.forEach(function (d) {
        selectValues.push(d.name);
    } ) ;

    selectValues.sort();

    select.selectAll("option")
        .data(selectValues, function (d) {return d;}) //uses a key so that the selectValues are appended to the option drop down, assuming that none of the life events/services are called something like "by name"!
        .enter()
        .append("option")
        .attr("value", function (d) {
            return d;
        })
        .text(function (d) { return d; });


    // Convert links to matrix; count character occurrences.
    graph.links.forEach(function(link) {
        matrix[link.source][link.target].z += 1;
        matrix[link.target][link.source].z += 1;
        matrix[link.source][link.source].z += 1;
        matrix[link.target][link.target].z += 1;
        nodes[link.source].count += 1;
        nodes[link.target].count += 1;
    });

    //shortestpath uses the force
    var force = d3.layout.force();
    force.nodes(graph.nodes);
    force.links(graph.links);
    force.start();

    var sp = new ShortestPathCalculator(graph.nodes, graph.links);

    // Precompute the orders.
    var orders = {
        name: d3.range(n).sort(function(a, b) { return d3.ascending(nodes[a].name, nodes[b].name); }),
        count: d3.range(n).sort(function(a, b) { return nodes[b].count - nodes[a].count; }),
        group: d3.range(n).sort(function(a, b) { return d3.ascending(nodes[a].group, nodes[b].group); }),
        distance: d3.range(n).sort(function(a, b) { return d3.ascending(nodes[a].distancetocentre, nodes[b].distancetocentre); })
    };

    // The default sort order.
    x.domain(orders.name);


    //draw some stuff

    svg.append("rect")
        .attr("class", "background")
        .attr("width", width)
        .attr("height", height);

    //line function for drawing boundary lines
    var lineFunction = d3.svg.line()
        .x(function(d) {
            return xBoundaryLines(d.x);
        })
        .y(function(d) {
            return yBoundaryLines(d.y);
        })
        .interpolate("linear");

    var row = svg.selectAll(".row")
        .data(matrix)
        .enter().append("g")
        .attr("class", "row")
        //.attr("class", function(d, i) {return nodes[i].name; }
        .attr("transform", function(d, i) { return "translate(0," + x(i) + ")"; })
        .each(row);

    row.append("line")
        .attr("x2", width);

    row.append("rect")
        .attr("class", "highlightBlock")
        .attr("x", -margin.left)
        .attr("width", margin.left)
        .attr("height", x.rangeBand())
        .style("fill", function (d, i) {

            return (nodes[i].group === "Services") ? "White" : "LightGray";

        });

    row.append("text")
        .attr("x", -10)
        .attr("y", x.rangeBand() / 2)
        .attr("dy", ".32em")
        .attr("text-anchor", "end")
        .style("font-weight", function (d, i) {

            return (nodes[i].group === "Services") ? "normal" : "bold";

        })
        .text(function(d, i) { return nodes[i].name; });

    var column = svg.selectAll(".column")
        .data(matrix)
        .enter().append("g")
        .attr("class", "column")
        .attr("transform", function(d, i) { return "translate(" + x(i) + ")rotate(-90)"; });

    column.append("line")
        .attr("x1", -width);

    column.append("rect")
        .attr("class", "highlightBlock")
        .attr("x", 0)
        .attr("width", margin.top)
        .attr("height", x.rangeBand())
        .style("fill", function (d, i) {

            return (nodes[i].group === "Services") ? "White" : "LightGray";

        });

    column.append("text")
        .attr("x", 10)
        .attr("y", x.rangeBand() / 2)
        .attr("dy", ".32em")
        .attr("text-anchor", "start")
        .style("font-weight", function (d, i) {
            return (nodes[i].group === "Services") ? "normal" : "bold";
        })
        .text(function(d, i) { return nodes[i].name; });

    function row(row) {
        var cell = d3.select(this).selectAll(".cell")
            .data(row.filter(function(d) { return d.z; }))
            .enter().append("rect")
            .attr("class", "cell")
            .attr("x", function(d) { return x(d.x); })
            .attr("width", x.rangeBand())
            .attr("height", x.rangeBand())
            //.style("fill-opacity", function(d) { return z(d.z); })
            .style("fill", "MediumBlue")
            .on("mouseover", mouseover)
            .on("mouseout", mouseout);
    }

    var boundaryLinesG = svg.append("g")
        .attr("class", "boundaryLinesG")
        .attr("width", width)
        .attr("height", height);

    function mouseover(p) {

        d3.selectAll(".row text").classed("active", function(d, i) { return i == p.y; });
        d3.selectAll(".column text").classed("active", function(d, i) { return i == p.x; });

        svg.append("rect")
            .attr("x",0)
            .attr("y", x(p.y))
            .attr("class", "highlight-bar")
            .attr("width", x(p.x))
            .attr("height", x.rangeBand());

        svg.append("rect")
            .attr("x", x(p.x))
            .attr("y",0)
            .attr("class", "highlight-bar")
            .attr("width", x.rangeBand())
            .attr("height", x(p.y));

    }

    function mouseout() {

        d3.selectAll("text").classed("active", false);
        d3.selectAll(".highlight-bar").remove();

    }

    d3.select("#order").on("change", function() {
        order(this.value);
    });

    //reorder everthing based on selection from drop down
    function order(value) {

        if (value === "name" || value === "count" || value === "group") {

            x.domain(orders[value]);

            //d3.selectAll(".boundaryLines").remove();
            var t = svg.transition().duration(1500);

            t.selectAll(".boundaryLines").attr("opacity", 0);

            t.selectAll(".row")
                .delay(function(d, i) { return x(i) * 4; })
                .attr("transform", function(d, i) { return "translate(0," + x(i) + ")"; })
                .selectAll(".cell")
                .delay(function(d) { return x(d.x) * 4; })
                .attr("x", function(d) { return x(d.x); });

            t.selectAll(".column")
                .delay(function(d, i) { return x(i) * 4; })
                .attr("transform", function(d, i) { return "translate(" + x(i) + ")rotate(-90)"; });

            t.selectAll(".boundaryLines").remove();

        } else if (value === "distance") { alert("Please choose a life event from the list below.");

        } else { //chosen life event or service from the drop down, so reorder based on distance to chosen life event / service

            //console.log(value);

            //reset distances count array

            boundaryLines = [];
            for (i = 0; i < n; i++) {
                boundaryLines.push(0);
            }
            //console.log("1: " + boundaryLines);

            //get the ID of the chosen node
            chosenNodeID = 0;
            nodes.forEach(function(d) { if (d.name === value) { chosenNodeID = d.index; } ; });

            //calculate distances from each node to chosen node
            //update distances count array
            nodes.forEach(function (d, i) {
                var route = sp.findRoute(d.index, chosenNodeID);
                d.distancetocentre = route.distance;
                boundaryLines[d.distancetocentre]++;

            });

            //remove any zero value groups
            //console.log("2: " + boundaryLines);

            var i;
            while (( i = boundaryLines.indexOf(0)) !== -1) {
                boundaryLines.splice(i, 1);
            };

            //console.log("3: " + boundaryLines);

            //sort rows, cells, columns
            orders["distance"] = d3.range(n).sort(function(a, b) { return d3.ascending(nodes[a].distancetocentre, nodes[b].distancetocentre); });

            x.domain(orders["distance"]);

            var t1 = svg.transition().duration(1500);
            //remove any boundary lines if they exist
            t1.selectAll(".boundaryLines").attr("opacity", 0);
            t1.selectAll(".boundaryLines").remove();

            t1.selectAll(".row")
                .delay(function(d, i) { return x(i) * 4; })
                .attr("transform", function(d, i) { return "translate(0," + x(i) + ")"; })
                .selectAll(".cell")
                .delay(function(d) { return x(d.x) * 4; })
                .attr("x", function(d) { return x(d.x); });

            t1.selectAll(".column")
                .delay(function(d, i) { return x(i) * 4; })
                .attr("transform", function(d, i) { return "translate(" + x(i) + ")rotate(-90)"; });

            d3.selectAll(".boundaryLines").remove();

            //draw new boundary lines
            boundaryLines.forEach(function (d, i) {

                if (i != 0 && i != (boundaryLines.length - 1)) {

                    var lineData;
                    var xyCoord, zeroCoord;

                    xyCoord = 0;
                    zeroCoord = 0;

                    boundaryLines.forEach(function (e, j) {
                        if (j <= i) {
                            //console.log(j + " - " + i);
                            xyCoord += e;
                        };
                    });

                    //console.log("xyCoord for " + i + ": " + xyCoord);

                    lineData = [{
                        "x": xyCoord,
                        "y": zeroCoord
                    }, {
                        "x": xyCoord,
                        "y": xyCoord
                    }, {
                        "x": zeroCoord,
                        "y": xyCoord
                    }];

                    //console.log(lineData);

                    boundaryLinesG.append("path")
                        .attr("d", lineFunction(lineData))
                        .classed("boundaryLines", true)
                        .attr("stroke", "DarkGray")
                        .attr("stroke-width", 2)
                        .attr("fill", "none")
                        .attr("opacity", 0);



                };
            });

            var t2 = t1.transition();
            t2.selectAll(".boundaryLines").attr("opacity", 1);

        };
    }

};

getNodeData();
getLinkData();