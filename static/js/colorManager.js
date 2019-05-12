
// COLOR MANAGEMENT

// declare 2 arrays - array 1: 10 colors using color brewer; array 2: storage array for colors used
let colors = ['#fb8072', '#8dd3c7','#ffffb3','#bebada','#80b1d3','#fdb462','#b3de69','#fccde5','#bc80bd','#ccebc5','#ffed6f']; //11 colors
let lockedWords = ['', '','','','','','','','','','']; //11

let colorTiles = ['#8dd3c7','#ffffb3','#bebada','#80b1d3','#fdb462','#b3de69','#fccde5','#bc80bd','#ccebc5','#ffed6f'];
colorTiles.forEach((d)=> {
    document.getElementById('colorScale').innerHTML += `<div class="row" id='` + d + `' style="height: 10%; background-color: ` + d + `"></div>`;
});


// declare function that assigns color to a class using a lookup function;
color ='';

function ColorToClass(className) {

    // check if word is locked
    if (lockedWords.includes(className)){
        // console.log("word is locked", className);
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

// the current word will appear in a color, as the hover effect will fire first, the idea is to check whether that
// color is locked already.
function lockColor (className){

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

                console.log('new color has been locked, i.e. new word has been selected -> recalculating data for' +
                    ' line chart -> calling' +
                    ' wrangleLineChartData');
                wrangleLineChartData(lockedWords, rawData);
                break;
            }
        }
    }
}


function lookUpColor (word){
    for (let i = 0; i < lockedWords.length; ++i) {
        if (lockedWords[i]=== word){
            return colors[i]
        }
    }
}