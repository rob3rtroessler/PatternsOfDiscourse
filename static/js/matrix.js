let matrixData = [];

function wrangeMatrixData() {

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

    console.log( matrixEdges);

    // finalize matrixData
    matrixData = {
        nodes: matrixNodes,
        links: matrixEdges
    };

    // draw MatrixVis
    drawMatrixVis(matrixData)
}

function drawMatrixVis(data) {

// define dimensions && margins
    let matrixMargin = { top: 100, right: 0, bottom: 50, left: 200 },
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

    console.log('edges:', data);

// Create rows for the matrix
    matrixNodes.forEach(function(node) {
        node.count = 0;
        node.group = groupToInt(node.group);
        matrix[node.index] = d3.range(total_items).map(item_index => {
            return {
                x: item_index,
                y: node.index,
                z: 0
            };
        });
    });


    console.log('nodes after:',matrix);

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
        .text((d, i) => capitalize_Words(matrixNodes[i].name));
    columns.append("text")
        .attr("class", "label")
        .attr("y", 100)
        .attr("y", matrixScale.bandwidth() / 2)
        .attr("dy", ".32em")
        .attr("text-anchor", "start")
        .text((d, i) => capitalize_Words(matrixNodes[i].name));

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
        tooltip.html(capitalize_Words(matrixNodes[p.y].name) + " [" + intToGroup(matrixNodes[p.y].group) + "]</br>" +
            capitalize_Words(matrixNodes[p.x].name) + " [" + intToGroup(matrixNodes[p.x].group) + "]</br>" +
            p.z + " trabalhos relacionados")
            .style("left", (d3.event.pageX + 30) + "px")
            .style("top", (d3.event.pageY - 50) + "px");
    }
    function mouseout() {
        d3.selectAll("text").classed("active", false);
        tooltip.transition().duration(500).style("opacity", 0);
    }

}

/* utils */
let groupToInt = function(area) {
    if(area === "exatas"){
        return 1;
    }else if (area === "educacao"){
        return 2;
    }else if (area === "humanas"){
        return 3;
    }else if (area === "biologicas"){
        return 4;
    }else if (area === "linguagem"){
        return 5;
    }else if (area === "saude"){
        return 6;
    }
};

let intToGroup = function(area) {
    if(area === 1){
        return "exatas";
    }else if (area === 2){
        return "educacao";
    }else if (area === 3){
        return "humanas";
    }else if (area === 4){
        return "biologicas";
    }else if (area === 5){
        return "linguagem";
    }else if (area === 6){
        return "saude";
    }
};
function capitalize_Words(str){
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
