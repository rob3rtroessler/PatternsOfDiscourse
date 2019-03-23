// declare variable to store wrangled data globally
let WrangledTexTileData =[];



function TexTileDataWrangling(data){

    // first, clear WrangledTexTileData
    WrangledTexTileData =[];

    // access actual data and store it in tmp variable relevantData
    relevantData = [];
    data.data.data.forEach(function(d){
        // console.log('test', d)
        //TODO if (d.textID in SelectedArray){
        if (true){
            relevantData.push(d);
        }
    });
    relevantData = data.data.data;
    console.log('relevant:', relevantData);

    // loop through all environments of relevant data and push to array 'WrangledTexTileData'
    relevantData.forEach( function (d){
        d.environments.forEach(function(d){
            WrangledTexTileData.push(d);
        })
      });

    console.log(WrangledTexTileData)
}


function TexTileVis (){

    // margin conventions
    let margin = {top: 20, right: 20, bottom: 20, left: 20};
    lineChartWidth = $("#FabricVisContainer").width() - margin.left - margin.right; // Use the window's width
    lineChartHeight = $("#FabricVisContainer").height() - margin.top - margin.bottom;

    // calculate dimensions
    console.log('available width in px:', lineChartWidth);
    console.log('available height in px:', lineChartHeight);

    let TexTileWidth = lineChartWidth/(15 + 1/4*14);

    // adapt div container and implement div scrolling if necessary


    // add tooltip div
    let tooltipDiv = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("width", $("#FabricVisContainer").width() + 10)
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
        // in case you wanna check all data available in a row: //console.log('test', d, this);

        let rectangles = d3.select(this).selectAll("rect").data(d);
        rectangles.enter().append("rect")
            .attr("class", function (d){return d})
            .attr("width", TexTileWidth)
            .attr("height", 12)
            .attr("x", function (d, i) {
                return (i*TexTileWidth*5/4)
            })
            .attr("y", i*25)
            .attr('fill', function(d){
                // console.log(d);
                if (d === 'Traum') {
                    return 'green'
                }
                else {
                    return 'lightgrey'
                }
            })
            .on('mouseover', function(d, i){

                // using jquery's css method to change the fill property of all rects with the same (class) name
                // but only unless they are not grey!
                //console.log($("." + d).attr('fill'));
                if ( ($("." + d).attr('fill')) !== 'green' ) {
                    $("." + d).css("fill", 'blue');
                }

                // tooltip
                tooltipDiv
                    .transition()
                    .duration(200)
                    .style("opacity", 0.88);

                // position tooltip
                tooltipDiv
                    .html("<b>"+ d + "</b>")
                    .style("left", function(d){
                        tmp = $("#CreateYourCorpusContainer").width();
                        console.log(tmp);
                        return (tmp + 46 +  "px")
                    })
                    .style("top", (d3.event.pageY +10) + "px");
            })
            .on('mouseout', function(d){
                // tooltip
                tooltipDiv.transition()
                    .duration(500)
                    .style("opacity", 0);

                // using jquery's css method to change the fill property of all rects with the same (class) name
                if ( ($("." + d).attr('fill')) !== 'green' ) {
                    $("." + d).css("fill", 'lightgrey')
                }

            })
    })
}


