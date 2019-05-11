// declare variable to store wrangled data globally
let rawData = [];
let WrangledTexTileData =[];



function TexTileDataWrangling(data){

    // store the data in rawData
    rawData = data;

    // first, clear WrangledTexTileData
    WrangledTexTileData =[];

    // access actual data and store it in tmp variable relevantData
    relevantData = [];
    data.data.data.forEach(function(d){
        if (true){
            relevantData.push(d);
        }
    });
    relevantData = data.data.data;

    // loop through all environments of relevant data and push to array 'WrangledTexTileData'
    relevantData.forEach( function (d){
        d.environments.forEach(function(d){
            WrangledTexTileData.push(d);
        })
      });
    console.log('data for TexTiles:', WrangledTexTileData);

    // draw TexTileVis
    TexTileVis(WrangledTexTileData);
}


function TexTileVis (data){

    // margin conventions using the parent div's entire width & calculating the hight by using # of environments
    let margin = {top: 20, right: 20, bottom: 20, left: 20};
    lineChartWidth = $("#FabricVisContainer").width() - margin.left - margin.right;
    lineChartHeight = (data.length*25 + 30) - margin.top - margin.bottom;

    // TODO: fix dimensions, especially with regard to the tooltip
    let TexTileWidth = lineChartWidth/(15 + 1/4*14);

    // add tooltip div
    let tooltipDiv = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("width", $("#FabricVisContainer").width())
        .style("opacity", 0)
        .style("left", "0px")
        .style("top", "0px");

    // Add the SVG to the page
    FabricSVG = d3.select("#FabricVisContainer").append("svg")
        .attr("id", "FabricVis")
        .attr("width", lineChartWidth + margin.left + margin.right)
        .attr("height", lineChartHeight + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let row = FabricSVG.selectAll(".row")
        .data(WrangledTexTileData);

    let newRows = row.enter()
        .append("g")
        .attr("class", 'FabricRow');

    newRows.each(function(d, i){
        // in case you wanna check all data available in a row: //
        // console.log('rowdata:', d, this);

        let rectangles = d3.select(this).selectAll("rect").data(d); //TODO: If I send
        rectangles.enter().append("rect")
            .attr("class", function (d){return d}) //TODO:  one solution would be to add a textID here
            .attr("width", TexTileWidth)
            .attr("height", 12)
            .attr("x", function (d, i) {
                return (i*TexTileWidth*5/4)
            })
            .attr("y", i*25)
            .attr('fill', function(d){

                // TODO: update! replace 'Traum' with var keyword. Store keyword when searching.
                if (d === 'Traum') {
                    return '#fb8072'
                }
                else {
                    return 'lightgrey'
                }
            })
            .on('mouseover', function(d, i){

                // assign color to the tile
                ColorToClass(d);

                // display tooltip
                tooltipDiv
                    .transition()
                    .duration(200)
                    .style("opacity", 0.88);

                // position tooltip
                tooltipDiv
                    .html("<b>"+ d + "</b>")
                    .style("left", function(d){
                        tmp = $("#CreateYourCorpusContainer").width();
                        // console.log(tmp);
                        return (tmp + 45 +  "px")
                    })
                    .style("top", (d3.event.pageY +10) + "px");
            })
            .on('mouseout', function(d){

                // remove color
                RemoveColorFromClass(d);

                // tooltip
                tooltipDiv.transition()
                    .duration(500)
                    .style("opacity", 0);
                })
            .on('click', function(d){

                // remove color
                lockColor(d);
            })
    });

    // TODO: ADD scrollbar
}

