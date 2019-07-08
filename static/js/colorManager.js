
// COLOR MANAGEMENT

// declare 2 arrays - array 1: 10 colors using color brewer; array 2: storage array for colors used
let colors = ['#fb8072', '#8dd3c7','#ffffb3','#bebada','#80b1d3','#fdb462','#b3de69','#fccde5','#bc80bd','#ccebc5','#ffed6f']; //11 colors
let lockedWords = ['', '','','','','','','','','','']; //11

let colorTiles = ['8dd3c7','ffffb3','bebada','80b1d3','fdb462','b3de69','fccde5','bc80bd','ccebc5','ffed6f'];
colorTiles.forEach((d)=> {
    document.getElementById('colorScale').innerHTML += `<div class="row" id='colorTile` + d + `' style="height: 10%; 
                                                            align-items: center; background-color:#` + d + `"></div>`;
});

async function initiateColorManager(data) {

    //console.log(data.data.metadata.CurrentKeyword);
    //lockedWords[0] = data.data.metadata.CurrentKeyword
    lockColor(data.data.metadata.CurrentKeyword);



}

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

    // check if word is locked, if so -> unlock
    if (lockedWords.includes(className)){
        // console.log("oh,", className, "is already locked! let's unlock/deselect it and then redraw the lineChart");

        // find position of word in lockedWords and unlock the word & color
        for (let i = 0; i < lockedWords.length; ++i) {
            if (lockedWords[i]=== className){

                // then write word into adequate colorTile
                let tmpID = 'colorTile' + lookUpColor(className).split('#')[1];
                document.getElementById(tmpID).innerHTML = '';

                // unlock word -> reset word position in array
                lockedWords[i] = '';

                // unlock color -> assign base color to class
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

                // assign color to class and lock the word
                ColorToClass(className);
                lockedWords[i] = className;

                // then write word into adequate colorTile
                let tmpID = 'colorTile' + lookUpColor(className).split('#')[1];
                document.getElementById(tmpID).innerHTML = `<div class="col-12 colorTileText">${className}</div>`;// `<span
                // class="colorTileTextSpan">${className}</span>`;

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

