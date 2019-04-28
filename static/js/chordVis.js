function drawChordGraph (data, words){

    console.log('data for ChordGraph:', data);

    let chorddata = data;
    let sortOrder = Object.keys(words);


// margins etc.
    let chordwidth= $("#Tab1masterRow").width()/2;
    let chordheight=$("#Tab1masterRow").height()*79/100;

// radius
    let radius = 0;
    if (chordwidth >= chordheight){
        radius = chordheight/3;
    }
    else {
        radius = chordwidth/3;
    }

// sort
    function sort(a,b){ return d3.ascending(sortOrder.indexOf(a),sortOrder.indexOf(b)); }

// define
    let ch = viz.ch().data(chorddata)
        .padding(.01)
        .sort(sort)
        .innerRadius(radius)
        .outerRadius(radius +15)
        .duration(1000)
        .chordOpacity(0.3)
        .labelPadding(.03)
        .fill(function(d){
            if (lockedWords.includes(d)){
                lockedWords.forEach((word,i) =>{
                    if (word === d){
                        return 'blue';
                    }
                });
            }
            else {
                return 'grey';
            }

            //return chordcolors[d];
        });

// svg
    let chordsvg = d3.select("#chordVisDiv").append("svg").attr("height",chordheight).attr("width",chordwidth);

// draw
    chordsvg.append("g").attr("transform", "translate(" + chordwidth/2+ "," + chordheight/2 + ")").call(ch);
}
