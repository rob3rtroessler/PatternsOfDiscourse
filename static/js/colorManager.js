
// COLOR MANAGEMENT

// declare 2 arrays - array 1: 10 colors using color brewer; array 2: storage array for colors used
let colors = ['#fb8072', '#8dd3c7','#ffffb3','#bebada','#80b1d3','#fdb462','#b3de69','#fccde5','#bc80bd','#ccebc5','#ffed6f']; //11 colors
let lockedWords = ['Traum', '','','','','','','','','','']; //11

let colorTiles = ['#8dd3c7','#ffffb3','#bebada','#80b1d3','#fdb462','#b3de69','#fccde5','#bc80bd','#ccebc5','#ffed6f'];
colorTiles.forEach((d)=> {
    document.getElementById('colorScale').innerHTML += `<div class="row" id='` + d + `' style="height: 10%; background-color: ` + d + `"></div>`;
});


// global, temporary color variable that is being used when assigning color to a word but NOT LOCKING IT.
let color ='';

// declare a lookup function that assigns color to a className, i.e. a TexTile word
function ColorToClass(className) {

    // check if word is locked
    if (lockedWords.includes(className)){
        // console.log(className, "is locked -> you are hovering over a colored tile!");
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
        // console.log("word is locked", className);
    }
    else {
        $("." + className)
            .css("fill", 'lightgrey')
            .css("background", 'transparent');
    }
}

// declare function that locks a color to a word
function lockColor (className){

    // check if word is locked
    if (lockedWords.includes(className)){
        // console.log("oh,", className, "is already locked");
        // console.log("let's unlock/deselect it and then redraw the lineChart");

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

                console.log('new color has been locked, i.e. new word has been selected -> recalculating data for' +
                    ' line chart -> calling wrangleLineChartData');
                break;
            }
        }
    }
    // since something has changed definitely, call wrangleLineChartData
    wrangleLineChartData(lockedWords, rawData);
}


function lookUpColor (word){
    for (let i = 0; i < lockedWords.length; ++i) {
        if (lockedWords[i]=== word){
            return colors[i]
        }
    }
}

function highlightLineThroughTile(word) {

    // highlightLineThroughTile only if word, i.e. tile is locked
    if (lockedWords.includes(word)){
        // console.log(word, "is locked, so let's highlight it");

        // then lookup the correct html element and send it to highlightSelectedLine
        let htmlElementID = document.getElementById('lineForWord' + word);
        highlightSelectedLine(htmlElementID, word);

        // then print word
        lineChartSvg.append("text")
            .attr("class", "title-text")
            .style('fill', lookUpColor(word))
            .text(word)
            .attr("text-anchor", "middle")
            .attr("x", (lineChartWidth)/2)
            .attr("y", -20);
    }
    else {
        // console.log(word, "word is not locked - no highlighting then!")
    }
}

function DeHighlightLineThroughTile(word) {

    // now we can grab global variable 'color' and create ID
    let ID = 'lineForWord' + word;

    // then lookup the correct html element and send it to highlightSelectedLine
    let htmlElementID = document.getElementById(ID);
    highlightOutSelectedLine(htmlElementID, word);

    // then remove the word
    lineChartSvg.select(".title-text").remove()
}

