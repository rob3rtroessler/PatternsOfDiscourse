
let WrangledFabricData =[];

async function initializeFabric (data){
    console.log('in async function, i.e. the initializer', data);
    FabricData = data
}

function initFabric(data){

    console.log('in initFabric', data);

    initializeFabric(data)
        .then( dataWrangling(data) )
        .then( FabricVis(WrangledFabricData) );
}


function dataWrangling(data){

    // first, clear WrangledFabricData
    WrangledFabricData =[];

    // access actual data and store it in tmp variable relevantData
    relevantData = data.data.data;

    relevantData.forEach( function (d){
        console.log(d.environments);

        let test = d.environments;
        test.forEach(function(d){
            console.log(d);
            WrangledFabricData.push(d);
        })
      });

    console.log(WrangledFabricData)
}


function FabricVis (){

    // margin conventions
    let margin = {top: 20, right: 20, bottom: 20, left: 20};
    lineChartWidth = $("#FabricVisContainer").width() - margin.left - margin.right; // Use the window's width
    lineChartHeight = $("#FabricVisContainer").height() - margin.top - margin.bottom;

    // calculate dimensions
    console.log('available width in px:', lineChartWidth);
    console.log('available height in px:', lineChartHeight);

    let TexTileWidth = lineChartWidth/(15 + 1/4*14);

    // adapt div container and implement div scrolling if necessary



    // Add the SVG to the page
    FabricSVG = d3.select("#FabricVisContainer").append("svg")
        .attr("id", "FabricVis")
        .attr("width", lineChartWidth + margin.left + margin.right)
        .attr("height", lineChartHeight + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let row = FabricSVG.selectAll(".row")
        .data(WrangledFabricData);

    let newRows = row.enter()
        .append("g")
        .attr("class", 'FabricRow');

    newRows.each(function(d, i){
        // in case you wanna check all data available in a row: //console.log('test', d, this);

        let rectangles = d3.select(this).selectAll("rect").data(d);
        rectangles.enter().append("rect")
            .attr("width", TexTileWidth)
            .attr("height", 12)
            .attr("x", function (d, i) {
                return (i*TexTileWidth*5/4)
            })
            .attr("y", i*25)
            .attr('fill', function(d){
                console.log(d);
                if (d === 'Traum') {
                    return 'green'
                }
                else {
                    return 'grey'
                }
            })

    })
}


