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
    console.log('relevant data for the TexTiles:', relevantData);

    // loop through all environments of relevant data and push to array 'WrangledTexTileData'
    relevantData.forEach( function (d){
        d.environments.forEach(function(d){
            WrangledTexTileData.push(d);
        })
      });

    console.log('processed data', WrangledTexTileData)
}


function TexTileVis (){

    // margin conventions
    let margin = {top: 20, right: 20, bottom: 20, left: 20};
    lineChartWidth = $("#FabricVisContainer").width() - margin.left - margin.right; // Use the window's width
    lineChartHeight = 850 - margin.top - margin.bottom;

    // calculate dimensions
    console.log('available width in px:', lineChartWidth);
    console.log('available height in px:', lineChartHeight);

    let TexTileWidth = lineChartWidth/(15 + 1/4*14);

    // adapt div container and implement div scrolling if necessary


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
                        console.log(tmp);
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
    })
}

// declare function that creats list with prominent tiles
function CreateProminentTileList (data) {
    // console.log(data);
    data.forEach( (d,i) => {
        // console.log(d,i);
        if (0 <= i && i < 10){
            document.getElementById('top10').innerHTML += `<div class="row listItem ` + d + `" onclick="lockColor('` + d + `', 1)" onmouseout="RemoveColorFromClass('` + d + `')" 
onmouseover="ColorToClass('` + d + `')">` + d + `</div>`
        }
        else if (10 <= i && i < 20){
            document.getElementById('top20').innerHTML += `<div class="row listItem ` + d + `" onclick="lockColor('` + d + `', 1)" onmouseout="RemoveColorFromClass('` + d + `')" 
onmouseover="ColorToClass('` + d + `')">` + d + `</div>`
        }
        else if (20 <= i && i < 30){
            document.getElementById('top30').innerHTML += `<div class="row listItem ` + d + `" onclick="lockColor('` + d + `', 1)" onmouseout="RemoveColorFromClass('` + d + `')" 
onmouseover="ColorToClass('` + d + `')">` + d + `</div>`
        }
    })

}

// COLOR MANAGEMENT

// declare 2 arrays - array 1: 10 colors using color brewer; array 2: storage array for colors used
let colors = ['#fb8072', '#8dd3c7','#ffffb3','#bebada','#80b1d3','#fdb462','#b3de69','#fccde5','#bc80bd','#ccebc5','#ffed6f']; //11 colors
let lockedWords = ['Traum', '','','','','','','','','','']; //11

let colorTiles = ['#8dd3c7','#ffffb3','#bebada','#80b1d3','#fdb462','#b3de69','#fccde5','#bc80bd','#ccebc5','#ffed6f'];
colorTiles.forEach((d)=> {
    document.getElementById('colorScale').innerHTML += `<div class="row listItem" style="background-color:` + d + `"></div>`

});


// declare function that assigns color to a class using a lookup function;
color ='';

function ColorToClass(className) {

    // check if word is locked
    if (lockedWords.includes(className)){
        console.log("oh, it's locked", className);
    }
    else {
        // if word is not locked find first color that is not used
        for (let i = 0; i < lockedWords.length; ++i) {
            if (lockedWords[i] ===''){
                color = colors[i];
                $("." + className)
                    .css("fill", color)
                    .css("background", color);
                break;
            }
        }
    }
}


// declare function that removes color from a class;
function RemoveColorFromClass (className){

    if (lockedWords.includes(className)){
        console.log("oh, it's locked", className);
    }
    else {
        $("." + className)
            .css("fill", 'lightgrey')
            .css("background", 'transparent');
    }
}

// the current word will appear in a color, as the hover effect will fire first, the idea is to check whether that
// color is locked already.
function lockColor (className, lockStatus){

    // check if word is locked
    if (lockedWords.includes(className)){
        console.log("oh, it's already locked", className);
        console.log("let's unlock it then");

        // find position of that word and unlock that color
        for (let i = 0; i < lockedWords.length; ++i) {
            if (lockedWords[i]=== className){

                // delete word from array
                lockedWords[i] = '';

                // assign base color to class
                $("." + className)
                    .css("fill", 'lightgrey')
                    .css("background", 'transparent');
                break;
            }
        }

    }

    // if not locked yet, lock word and assign color
    else {
        for (let i = 0; i < lockedWords.length; ++i) {
            if (lockedWords[i]===''){
                ColorToClass(className);
                lockedWords[i] = className;
                console.log(lockedWords);
                break;
            }
        }
    }
}