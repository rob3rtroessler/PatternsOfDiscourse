function ForceGraph(divID) {

    console.log("ForceGraph() running @div: #" + divID);
    // introduce margins
    let margin = {top: 10, right: 50, bottom: 50, left: 50};

    // define SVG Size
    let width = $("#"+divID).width() - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // Define svg_MartiniTwo_StackedArea as a child-element (g) of the drawing area and include spaces
    let svg = d3.select("#" + divID).append("svg")
        .attr("id", "FDG-AuthorNetwork")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let simulation = d3.forceSimulation()

    // playing around with distance
        .force("link", d3.forceLink().distance(function (d) {
            return 170
        }).id(function (d) {
            return d.id;
        }))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));

    d3.json("Script/data/authors.json", function (error, graph) {
        if (error) throw error;


        console.log("data:", graph);

        let link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(graph.connections)
            .enter().append("line");

        let node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(graph.authors)
            .enter().append("circle")
            .attr("class", "circle")
            .attr("r", 12.5)
            .on("mouseover", function(d){
                d3.select(this).select("circle").transition()
                    .duration(750)
                    .attr("r", 16);
            })
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        node.append("title")
            .text(function (d) {
                return d.id;
            });

        simulation
            .nodes(graph.authors)
            .on("tick", ticked);

        simulation.force("link")
            .links(graph.connections);

        function ticked() {
            link
                .attr("x1", function (d) {
                    return d.source.x;
                })
                .attr("y1", function (d) {
                    return d.source.y;
                })
                .attr("x2", function (d) {
                    return d.target.x;
                })
                .attr("y2", function (d) {
                    return d.target.y;
                })
                // the style can reflect the correspondence
                .style("stroke", "#aaa")
                .style("stroke-width", function (d) {

                    //former: return d.value + "px"}
                    return strokeWidth(d.value)
                })
                ;

            node
                .attr("xlink:href", function (d) {
                    return d.img;
                })
                .attr("cx", function (d) {
                    return d.x;
                })
                .attr("cy", function (d) {
                    return d.y;
                })
                .attr("height", 50)
                .attr("width", 50);
        }
    });

    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    /*
        CUSTOMIZING OUR GRAPH:
    */

    // DISTANCE
    function closeness(preCalculatedValue) {


        let distance = preCalculatedValue * 2;

        // return
        return distance;
    }


    // STROKE WIDTH
    function strokeWidth(preCalculatedValue){

        // define the stroke-width representing the current 'connection' between two authors here:
        let strokeWidth = preCalculatedValue / 30 + "px";

        // returning the computed stroke-width
        return strokeWidth;
    }
}






