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
                    return '#fb8072'
                }
                else {
                    return 'lightgrey'
                }
            })
            .on('mouseover', function(d, i){

                // using jquery's css method to change the fill property of all rects with the same (class) name
                // but only unless they are not grey!
                //console.log($("." + d).attr('fill'));
                /*if ( ($("." + d).attr('fill')) !== 'green' ) {
                    $("." + d).css("fill", 'blue');
                }*/
                ColorToClass(d);

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
    console.log(data);
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
let colors = ['#8dd3c7','#ffffb3','#bebada','#80b1d3','#fdb462','#b3de69','#fccde5','#bc80bd','#ccebc5','#ffed6f'];
let taken = [0,0,0,0,0,0,0,0,0,0];
let word = ['','','','','','','','','',''];
let locked = [0,0,0,0,0,0,0,0,0,0];
//let lockedWords = ['','','','','','','','','',''];


colors.forEach((d)=> {
    document.getElementById('colorScale').innerHTML += `<div class="row listItem" style="background-color:` + d + `"></div>`

});


// declare function that assigns color to a class using a lookup function;
function ColorToClass(className) {

    console.log('checking whether to assign color');

    let color = assignColor(className);

    // assign color => only if not locked
    $("." + className)
        .css("fill", color)
        .css("background", color);

}


// declare function that removes color from a class;
function RemoveColorFromClass (className){

    // first, remove 'word' and 'taken', but only if that particular word isn't locked!
    for (let i = 0; i < word.length; ++i) {

        // remove that word from word-array and taken-array
        if (word[i] === className && locked[i]===0){
            console.log('removing');
            word[i] = '';
            taken[i] = 0;

            $("." + className)
                .css("fill", 'lightgrey')
                .css("background", 'transparent');
        }
        else {
            console.log("oh, it's locked", className)
        }

    }
}


// declare lookup function for color
function assignColor (className){
    for (let i = 0; i < taken.length; ++i) {
        if (taken[i] === 0){
            word[i] = className;
            taken[i] = 1;
            console.log("word:", word);
            console.log("taken:", taken);
            console.log("locked:", locked);
            return colors[i];
        }
    }
}


// the current word will appear in a color, as the hover effect will fire first, the idea is to check whether that
// color is locked already.
function lockColor (className, lockStatus){

    // loop over all words and check if that current word is locked
    for (let i = 0; i < word.length; ++i) {


        // get position of word
        if (word[i] === className){
            locked[i] = 1;
            console.log("in locked function");


            // now assign color - however, before that you have to tell the system, that the current taken item is
            // not yet taken
            taken[i] = 0;

            console.log("word:", word);
            console.log("taken:", taken);
            console.log("locked:", locked);
            console.log("lock color calls ColorToClass");
            ColorToClass(className)
        }
    }
}