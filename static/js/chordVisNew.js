function wrangleChordData () {

    // first grab all words we're interested in and store in variable

    // in oder to do that, we need to check what option the user chose:
    if (document.getElementById("filterBySelectedWords").checked) {

        // just grab the selected Words
        console.log('filterBySelectedWords');

        let selectedWords = ['word1', 'word2', 'word3', 'word4'];
        let matrix = [];

        selectedWords.forEach( word => {
            tmpArray = [];

            // now loop over all edges, i.e. the info to fill
            edges.forEach( d => {
                if (d.from === word){

                }
            });
            matrix.push({[word] : ['array ' + word]})
        });



        console.log('matrix', matrix);

        matrix = [
            [0,  5871, 8916, 2868],
            [ 1951, 0, 2060, 6171],
            [ 8010, 16145, 0, 8045],
            [ 1013,   990,  940, 0]
        ];

        // draw the chord vis
        drawChordVis(matrix);
    }

    if (document.getElementById("filterBySelectedWordsAndEnvironments").checked) {
        // do a lot of data wrangling
    }

    if (document.getElementById("noFilters").checked) {
        // do the entire thing - no restrictions

    }
}

function drawChordVis (matrix) {

    // create the svg area
    let chordSvg = d3.select("#chordVisDiv")
        .append("svg")
        .attr("width", 440)
        .attr("height", 440)
        .append("g")
        .attr("transform", "translate(220,220)");

    // create a matrix
    /*let matrix = [
        [0,  5871, 8916, 2868],
        [ 1951, 0, 2060, 6171],
        [ 8010, 16145, 0, 8045],
        [ 1013,   990,  940, 0]
    ];*/

    // 4 groups, so create a vector of 4 colors
    let chordColors = [ "#440154ff", "#31668dff", "#37b578ff", "#fde725ff"];

    // give this matrix to d3.chord(): it will calculates all the info we need to draw arc and ribbon
    let res = d3.chord()
        .padAngle(0.05)
        .sortSubgroups(d3.descending)
        (matrix);

    console.log('res:', res);

    // add the groups on the outer part of the circle
    chordSvg
        .datum(res)
        .append("g")
        .selectAll("g")
        .data(function(d) { return d.groups; })
        .enter()
        .append("g")
        .append("path")
        .style("fill", function(d,i){ return chordColors[i] })
        .style("stroke", "black")
        .attr("d", d3.arc()
            .innerRadius(200)
            .outerRadius(210)
        );

    // Add the links between groups
    chordSvg
        .datum(res)
        .append("g")
        .selectAll("path")
        .data(function(d) { return d; })
        .enter()
        .append("path")
        .attr("d", d3.ribbon()
            .radius(200)
        )
        .style("fill", function(d){ return(chordColors[d.source.index]) }) // colors depend on the source group. Change to
        // target otherwise.
        .style("stroke", "black")
        .on('mouseover', function(d){this.append("text").text('test')});
}