
/* * * * * * * * * * * * * * *
     Initialize LineChart
 * * * * * * * * * * * * * * */

// define parameters & global variables
let duration = 250;

let lineOpacity = "1";
let lineOpacityHover = "1";
let otherLinesOpacityHover = "0.1";
let lineStroke = "2px";
let lineStrokeHover = "4px";

let circleOpacity = '1';
let circleOpacityOnLineHover = "0.2";
let circleRadius = 5;
let circleRadiusHover = 9;


let lineChartDiv = $("#lineChartSVG");

// margin conventions
let lineChartMargins = {top: 50, right: 50, bottom: 20, left: 50},
    lineChartWidth = lineChartDiv.width() - lineChartMargins.left - lineChartMargins.right,
    lineChartHeight = lineChartDiv.height() - lineChartMargins.top - lineChartMargins.bottom;

/* Add SVG */
let lineChartSvg = d3.select("#LineChartSVG").append("svg")
    .attr("width", lineChartDiv.width() + lineChartMargins.left + lineChartMargins.right)
    .attr("height", lineChartDiv.height() + lineChartMargins.top + lineChartMargins.bottom)
    .append('g')
    .attr("transform", "translate(" + lineChartMargins.left + "," + lineChartMargins.top + ")")
    .attr('id', 'LineChartSVGinner');

/* * * * * * * * * * * * * * *
     WRANGLE LineChart DATA
 * * * * * * * * * * * * * * */

async function wrangleLineChartData(ArrayOfLockedWords, data) {

    // first, prepare an array with locked keywords
    let keywords = [];
    ArrayOfLockedWords.forEach( word => {
        if (word !== ''){
            keywords.push(word);
        }
    });

    // set up timeParser
    let parseDate = d3.timeParse("%Y%m%d");

    // define empty overall helper array
    let tmpOverall = [];

    // START: Analyze corpus data by looping through the texts.
    data.data.data.forEach( text => {

        // date of current text
        let dateOfText = parseDate(text.year + '0101');

        // initiate helperStructure
        let tmpStructure = {};
        keywords.forEach( keyword => {
            tmpStructure[keyword] = 0;
        });

        // initialize tmpCount to keep track of # of environments
        let tmpCount = 0;

        // loop through all environments and fill the temporary helperStructure with correct count
        text.environments.forEach( environment => {

            tmpCount += 1;
            environment.forEach( word => {
                if (keywords.includes(word)){
                    tmpStructure[word] += 1;
                }
            })
        });

        // fill the overall helper Array
        keywords.forEach( keyword => {
            tmpOverall.push(
                {
                    word: keyword,
                    value: tmpStructure[keyword],
                    date: dateOfText,
                    relativeValue: tmpStructure[keyword]/tmpCount*100
                }
            )})
    });

    //
    let wrangledData = [];
    let maximumY = 0;
    //
    keywords.forEach(keyword => {
        let wordValues = [];
        tmpOverall.forEach( element => {
            if (keyword === element.word){
                let tmp = {
                    date: element.date,
                    occurences: element.value,
                    relativeOccurences: element.relativeValue,
                    word: element.word // looks redundant, but we need to access the word also on the element level!
                };
                if (element.relativeValue > maximumY){
                    maximumY = element.relativeValue
                }
                wordValues.push(tmp)
            }
        });

        //
        let superTmp = {
            word : keyword,
            values: wordValues,
        };

        wrangledData.push(superTmp)
    });

    console.log('data for LineChart:', wrangledData);
    drawLineChart (maximumY, wrangledData);
}



/* * * * * * * * * * * * * * *
   Draw & Update LineChart
 * * * * * * * * * * * * * * */

function drawLineChart (maximumY, data) {


    // preliminary, trivial solution since enter, merge(), transition method is a little bit tricky with the
    // multiple circles
    document.getElementById('LineChartSVGinner').innerHTML ='';

    /* Initialize Scales */
    let lineChartScaleX = d3.scaleTime()
        .range([0, lineChartWidth]);

    let lineChartScaleY = d3.scaleLinear()
        .range([lineChartHeight, 0]);

// initialize x axis
    lineChartSvg.append("g")
        .attr("class", "x-axisLineChart")
        .attr("transform", `translate(0, ${lineChartHeight})`);


    lineChartSvg.append("g")
        .attr("class", "y-axisLineChart");




    /* finalizing scales */
    lineChartScaleX.domain(d3.extent(data[0].values, d => d.date));
    lineChartScaleY.domain([0, maximumY]);

    /* Add line into SVG */
    let line = d3.line()
        .x(d => lineChartScaleX(d.date))
        .y(d => lineChartScaleY(d.relativeOccurences))
        .curve(d3.curveCatmullRom);

    let lines = lineChartSvg.append('g')
        .attr('class', 'lines');

    // draw the lines
    lines.selectAll('.line-group')
        .data(data).enter()
        .append('path')
        .attr('class', d => {return 'line '}) // TODO use this class!
        .attr('d', d => line(d.values))
        .attr('id', d => {return ('lineForWord'+ d.word)})
        .style('stroke', (d, i) => lookUpColor(d.word))
        .style('opacity', lineOpacity)
        .on("mouseover",  function (d) { highlightLineThroughTile(d.word) })
        .on("mouseout", function(d) { DeHighlightLineThroughTile(d.word) });

    /* Add circles in the line */
    lines.selectAll("circle-group")
        .data(data).enter()
        .append("g")
        .style("fill", (d) => { return ( lookUpColor(d.word) )})
        .selectAll("circle")
        .data(d => d.values).enter()
        .append("g")
        .attr("class", function (d){ return ('circle circleForLine' + d.word) })
        .on("mouseover", function(d) {
            d3.select(this)
                .style("cursor", "pointer")
                .append("text")
                .attr("class", "text")
                .text(`so oft: ${d.occurences}, relativ: ${d.relativeOccurences}`)
                .attr("x", d => lineChartScaleX(d.date) + 5)
                .attr("y", d => lineChartScaleY(d.relativeOccurences) - 10);
        })
        .on("mouseout", function(d) {
            d3.select(this)
                .style("cursor", "none")
                .transition()
                .duration(duration)
                .selectAll(".text").remove();
        })
        .append('circle')
        .attr("cx", d => lineChartScaleX(d.date))
        .attr("cy", d => lineChartScaleY(d.relativeOccurences))
        .attr("r", circleRadius)
        .style('opacity', circleOpacity)
        .on('mouseover', function(d) {
            d3.select(this)
                .transition()
                .duration(duration)
                .attr("r", circleRadiusHover);
        })
        .on("mouseout", function(d) {
            d3.select(this)
                .transition()
                .duration(duration)
                .attr("r", circleRadius);
        });

    // set up axis
    let xAxis = d3.axisBottom(lineChartScaleX).ticks(5);
    let yAxis = d3.axisLeft(lineChartScaleY).ticks(5).tickFormat(d => d + "%");

    // add axis in such a way that they update automatically
    lineChartSvg.selectAll(".x-axisLineChart")
        .transition()
        .call(xAxis);

    lineChartSvg.selectAll(".y-axisLineChart")
        .transition()
        .call(yAxis);
}



/* * * * * * * * * * * * * * *
      Helper Functions
 * * * * * * * * * * * * * * */

function highlightSelectedLine (id, word) {
    // console.log(id, word);

    // set low opacity to all lines
    d3.selectAll('.line')
        .style('opacity', otherLinesOpacityHover);

    // then set high opacity to selected line
    d3.select(id)
        .style('opacity', lineOpacityHover)
        .style("stroke-width", lineStrokeHover)
        .style("cursor", "pointer");

    // then set low opacity to all circles;
    d3.selectAll('.circle')
        .style('opacity', circleOpacityOnLineHover);

    // then set high opacity value to circles of selected line
    d3.selectAll('.circleForLine'+ word)
        .style('opacity', 1);


}

function highlightOutSelectedLine (id, word) {

    d3.selectAll(".line")
        .style('opacity', lineOpacity)
        .style("stroke-width", lineStroke);
    d3.selectAll('.circle')
        .style('opacity', circleOpacity);
    d3.select(id)
        .style("stroke-width", lineStroke)
        .style("cursor", "none");
}
