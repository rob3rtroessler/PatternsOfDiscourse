let matrixData = [];

function wrangleMatrixData() {

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

    // draw MatrixVis
    drawMatrixVis(matrixData)
}

function drawMatrixVis(data) {

// define dimensions && margins
    let matrixMargin = { top: 80, right: 80, bottom: 50, left: 80 },
        matrixWidth = $("#CreateYourCorpusContainer").height()  - matrixMargin.top -10,
        matrixHeight =$("#CreateYourCorpusContainer").height() - matrixMargin.top -10;

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

    let matrix = [];
    let matrixNodes = data.nodes;
    let total_items = matrixNodes.length;

// scales
    let matrixScale = d3.scaleBand().range([0, matrixWidth]).domain(d3.range(total_items));
    let opacityScale = d3.scaleLinear().domain([0, 10]).range([0.3, 1.0]).clamp(true);
    let colorScale = d3.scaleOrdinal(d3.schemeCategory10);

// Create rows for the matrix
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


// Fill matrix with data from links and count how many times each item appears
    data.links.forEach(function(link) {
        matrix[link.source][link.target].z += link.value;
        matrix[link.target][link.source].z += link.value;
        matrixNodes[link.source].count += link.value;
        matrixNodes[link.target].count += link.value;
    });
// Draw each row (translating the y coordinate)
    let rows = matrixSvg.selectAll(".row")
        .data(matrix)
        .enter().append("g")
        .attr("class", "row")
        .attr("transform", (d, i) => {
            return "translate(0," + matrixScale(i) + ")";
        });
    let squares = rows.selectAll(".cell")
        .data(d => d.filter(item => item.z > 0))
        .enter().append("rect")
        .attr("class", "cell")
        .attr("x", d => matrixScale(d.x))
        .attr("width", matrixScale.bandwidth())
        .attr("height", matrixScale.bandwidth())
        .style("fill-opacity", d => opacityScale(d.z)).style("fill", d => {
            return matrixNodes[d.x].group === matrixNodes[d.y].group ? colorScale(matrixNodes[d.x].group) : "grey";
        })
        .on("mouseover", mouseover)
        .on("mouseout", mouseout);
    let columns = matrixSvg.selectAll(".column")
        .data(matrix)
        .enter().append("g")
        .attr("class", "column")
        .attr("transform", (d, i) => {
            return "translate(" + matrixScale(i) + ")rotate(-90)";
        });
    rows.append("text")
        .attr("class", "label")
        .attr("x", -5)
        .attr("y", matrixScale.bandwidth() / 2)
        .attr("dy", ".32em")
        .attr("text-anchor", "end")
        .text((d, i) => matrixNodes[i].name);
    columns.append("text")
        .attr("class", "label")
        .attr("y", 100)
        .attr("y", matrixScale.bandwidth() / 2)
        .attr("dy", ".32em")
        .attr("text-anchor", "start")
        .text((d, i) => matrixNodes[i].name);

// Precompute the orders.
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
    d3.select("#order").on("change", function() {
        changeOrder(this.value);
    });
    function changeOrder(value) {
        matrixScale.domain(orders[value]);
        let t = matrixSvg.transition().duration(2000);
        t.selectAll(".row")
            .delay((d, i) => matrixScale(i) * 4)
            .attr("transform", function(d, i) {
                return "translate(0," + matrixScale(i) + ")";
            })
            .selectAll(".cell")
            .delay(d => matrixScale(d.x) * 4)
            .attr("x", d => matrixScale(d.x));
        t.selectAll(".column")
            .delay((d, i) => matrixScale(i) * 4)
            .attr("transform", (d, i) => "translate(" + matrixScale(i) + ")rotate(-90)");
    }

    rows.append("line")
        .attr("x2", matrixWidth);
    columns.append("line")
        .attr("x1", -matrixWidth);
    let tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

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
