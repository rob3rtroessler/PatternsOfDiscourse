function initLineChart (){
    let margin = {top: 30, right: 10, bottom: 20, left: 30};
        lineChartWidth = $("#sentiment").width() - margin.left - margin.right; // Use the window's width
        lineChartHeight = 140 - margin.top - margin.bottom;

    // Add the SVG to the page
    lineChartSVG = d3.select("#sentiment").append("svg")
        .attr("id", "FDG-AuthorNetwork")
        .attr("width", lineChartWidth + margin.left + margin.right)
        .attr("height", lineChartHeight + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
}

console.log('initializing lineChart');



// updating LineChart
function updateLineChart(svgID,data,range,senderID,recipientID){

    // perfect example here: http://bl.ocks.org/d3noob/7030f35b72de721622b8
    // https://bl.ocks.org/NGuernse/9e4b5232394d853bd76d94bde102fa9c

    console.log('range in linechart:',range);

    // create empty array for relevant letters
    let relevantLetters = [];

    // filter the data for sender-recipient-pair
    data.forEach(d=>{
        if(d.senderID === parseInt(senderID) && d.recipientID === parseInt(recipientID) ||
            d.senderID === parseInt(recipientID) && d.recipientID === parseInt(senderID)){
            relevantLetters.push(d);
        }
    });

    // sort relevant letters by time since we need them in order for the line chart
    let relevantLettersSortedByTime = _.sortBy(relevantLetters, 'date');

    // Set the ranges
    let LineChartScaleX = d3.scaleTime()
        .range([0, lineChartWidth]);

    let LineChartScaleY = d3.scaleLinear()
        .range([lineChartHeight, 0]);

    // Define the axes
    let xAxis = d3.axisBottom().scale(LineChartScaleX);
    let yAxis = d3.axisLeft().scale(LineChartScaleY).ticks(5);

    // Scale the range of the data - as range comes as [Year, Year] we need to parseYear
    let parseYear = d3.timeParse("%Y");

    // adding domains
    LineChartScaleX.domain([parseYear(range[0]),parseYear(range[1])]);
    LineChartScaleY.domain([-1, 1]);

    // create class for x axis
    lineChartSVG.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", "translate(0," + lineChartHeight + ")");

    // update x axis ticks
    lineChartSVG.select(".x-axis")
        .transition().duration(800)
        .call(xAxis);


    // Add the Y Axis
    lineChartSVG.append("g")
            .attr("class", "y axis")
            .call(yAxis);



    /*
        DRAWING THE LINE
    */

    // Define the line
    let line = d3.line()
        .x(function(d) { return LineChartScaleX(d.x); }) // set the x values for the line generator
        .y(function(d) { return LineChartScaleY(d.y); }) // set the y values for the line generator
        .curve(d3.curveMonotoneX); // apply smoothing to the line


    // creating array line chart data points - data structure: [{x: date, y: -1},{}, ...]
    let lineData = [];

    let lastYvalue = 0;
    let lastYdate = {};

    // filling in lineData
    // start is going to be at y value 0
    lineData.push({x: parseYear(range[0]), y: 0});

    // calculating value for every
    relevantLettersSortedByTime.forEach(d=>{

        //TODO ALGORITHM IS HERE!
        // sliderdata here: selectedLengthOfLettersSliderValue + selectedNumberOfLettersSliderValue + selectedSentimentOfLettersSliderValue
        // console.log(lastYvalue, "+", d.sentiment);


        let computedYtmp = lastYvalue
            //+ relevantLettersSortedByTime.length/averageLettersInCorrespondence*selectedNumberOfLettersSliderValue/100
            + d.letterLength/averageLetterLength*selectedLengthOfLettersSliderValue/33
            * selectedSentimentOfLettersSliderValue/33*(Math.pow(d.sentiment, 3));

        if (computedYtmp > 1){
            computedYtmp = 1
        }
        if (computedYtmp <= -1){
            computedYtmp = - 1
        }

        // enter computed value in lineData
        lineData.push({
            x: d.date,
            y: computedYtmp
        });

        lastYdate = d.date;
        lastYvalue = computedYtmp;
    });

    lineData.push({x: parseYear(range[1]), y: 0});

    // draw the line
    lineChartSVG.append("path").attr("class", "line");

    let graph = d3.select(".line").datum(lineData);
    graph.enter()
        .merge(graph)
        .transition()
        .duration(800)
        .attr("d", line);

    lineChartSVG.exit().remove();

}

function removeLineChart() {
    $("#sentiment").html('')
}

