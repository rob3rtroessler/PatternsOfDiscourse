
/* * * * * * * * * * * * * * *
     Initialize LineChart
 * * * * * * * * * * * * * * */

// define parameters
let duration = 250;

let lineOpacity = "1";
let lineOpacityHover = "1";
let otherLinesOpacityHover = "0.1";
let lineStroke = "2px";
let lineStrokeHover = "4px";

let circleOpacity = '1';
let circleOpacityOnLineHover = "0.5";
let circleRadius = 5;
let circleRadiusHover = 9;

// margin conventions
let lineChartMargins = {
    top: 50,
    right: 50,
    bottom: 20,
    left: 50
};
let lineChartDiv = $("#lineChartSVG");
console.log(lineChartDiv, lineChartDiv.width(), lineChartDiv.height());
let lineChartWidth = lineChartDiv.width() - lineChartMargins.left - lineChartMargins.right;
let lineChartHeight = lineChartDiv.height() - lineChartMargins.top - lineChartMargins.bottom;

console.log('hohe:', lineChartHeight);
let spakkenTest = lineChartHeight;
/* Add SVG */
let lineChartSvg = d3.select("#LineChartSVG").append("svg")
    .attr("width", lineChartDiv.width() + lineChartMargins.left + lineChartMargins.right)
    .attr("height", lineChartDiv.height() + lineChartMargins.top + lineChartMargins.bottom)
    .append('g')
    .attr("transform", "translate(" + lineChartMargins.left + "," + lineChartMargins.top + ")");


/* Initialize Scales */
let lineChartScaleX = d3.scaleTime()
    .range([0, lineChartWidth]);

let lineChartScaleY = d3.scaleLinear()
    .range([lineChartHeight, 0]);

console.log('hohe:', lineChartHeight);


/* * * * * * * * * * * * * * *
     WRANGLE LineChart DATA
 * * * * * * * * * * * * * * */

async function wrangleLineChartData(ArrayOfLockedWords, data) {
    console.log('hohe:', lineChartHeight);
    // first, prepare an array with locked keywords
    let keywords = [];
    ArrayOfLockedWords.forEach( word => {
        if (word !== '' && word !== 'Traum'){
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
                    relativeValue: tmpStructure[keyword]/tmpCount
                }
            )})
    });

    //
    let wrangledData = [];

    //
    keywords.forEach(keyword => {
        let wordValues = [];
        tmpOverall.forEach( element => {
            if (keyword === element.word){
                let tmp = {
                    date: element.date,
                    occurences: element.value,
                    relativeOccurences: element.relativeValue
                };
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

    console.log('FINALE', wrangledData);
    updateLineChart (wrangledData);
}



/* * * * * * * * * * * * * * *
   Draw & Update LineChart
 * * * * * * * * * * * * * * */

function updateLineChart (data) {

    /* finalizing scales */
    lineChartScaleX.domain(d3.extent(data[0].values, d => d.date));
    lineChartScaleY.domain([0, d3.max(data[0].values, d => d.relativeOccurences)]);

    /* Add line into SVG */
    let line = d3.line()
        .x(d => lineChartScaleX(d.date))
        .y(d => lineChartScaleY(d.relativeOccurences));

    let lines = lineChartSvg.append('g')
        .attr('class', 'lines');

    // draw the lines
    lines.selectAll('.line-group')
        .data(data).enter()
        .append('g')
        .attr('class', 'line-group')
        .on("mouseover", function(d, i) {
            lineChartSvg.append("text")
                .attr("class", "title-text")
                .style('fill', lookUpColor(d.word))
                .text(d.word)
                .attr("text-anchor", "middle")
                .attr("x", (lineChartWidth)/2)
                .attr("y", -20);
        })
        .on("mouseout", function(d) {
            lineChartSvg.select(".title-text").remove();
        })
        .append('path')
        .attr('class', d => {return 'line '}) // TODO use this class!
        .attr('d', d => line(d.values))
        .attr('id', d => {return ('lineWithColor'+ lookUpColor(d.word))})
        .style('stroke', (d, i) => lookUpColor(d.word))
        .style('opacity', lineOpacity)
        .on("mouseover",  function () { highlightSelectedLine(this); }) // using ES5 notation to grab 'this' -> https://medium.freecodecamp.org/when-and-why-you-should-use-es6-arrow-functions-and-when-you-shouldnt-3d851d7f0b26
        .on("mouseout", function() { highlightOutSelectedLine(this); });



    /* Add circles in the line */
    lines.selectAll("circle-group")
        .data(data).enter()
        .append("g")
        .style("fill", (d) => {return ( lookUpColor(d.word) )})
        .selectAll("circle")
        .data(d => d.values).enter()
        .append("g")
        .attr("class", "circle")
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


    /* Add Axis into SVG */
    let xAxis = d3.axisBottom(lineChartScaleX).ticks(5);
    let yAxis = d3.axisLeft(lineChartScaleY).ticks(5);

    lineChartSvg.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0, 200)`)
        .call(xAxis);

    console.log(lineChartHeight, spakkenTest, '${lineChartHeight}');
    lineChartSvg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append('text')
        .attr("y", 15)
        .attr("transform", "rotate(-90)")
        .attr("fill", "#000")
        .text("Total values");
}



/* * * * * * * * * * * * * * *
      Helper Functions
 * * * * * * * * * * * * * * */

function highlightSelectedLine (id) {

    d3.selectAll('.line')
        .style('opacity', otherLinesOpacityHover);
    d3.selectAll('.circle')
        .style('opacity', circleOpacityOnLineHover);
    d3.select(id)
        .style('opacity', lineOpacityHover)
        .style("stroke-width", lineStrokeHover)
        .style("cursor", "pointer");
}

function highlightOutSelectedLine (id) {
    d3.selectAll(".line")
        .style('opacity', lineOpacity);
    d3.selectAll('.circle')
        .style('opacity', circleOpacity);
    d3.select(id)
        .style("stroke-width", lineStroke)
        .style("cursor", "none");
}



