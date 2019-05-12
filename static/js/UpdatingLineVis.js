
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
let lineChartDiv = $("#lineChartSVG"),
    lineChartMargins = {top: 50, right: 50, bottom: 20, left: 50},
    lineChartWidth = lineChartDiv.width() - lineChartMargins.left - lineChartMargins.right,
    lineChartHeight = lineChartDiv.height() - lineChartMargins.top - lineChartMargins.bottom;

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

// initialize x axis
lineChartSvg.append("g")
    .attr("class", "x-axisLineChart")
    .attr("transform", `translate(0, ${lineChartHeight})`);

lineChartSvg.append("g")
    .attr("class", "y-axisLineChart");


// initialize new sub group 'lines'
lineChartSvg.append('g')
    .attr('class', 'lines');

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
                    relativeOccurences: element.relativeValue
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

    // console.log('FINALE', wrangledData);
    updateLineChart (maximumY, wrangledData);
}



/* * * * * * * * * * * * * * *
   Draw & Update LineChart
 * * * * * * * * * * * * * * */

function updateLineChart (maximumY, data) {

    console.log('running', data);

    /* finalizing scales */
    lineChartScaleX.domain(d3.extent(data[0].values, d => d.date));
    lineChartScaleY.domain([0, maximumY]);

    //console.log(d3.max(data[0].values, d => d.relativeOccurences));


    /* Add line into SVG */
    let line = d3.line()
        .x(d => lineChartScaleX(d.date))
        .y(d => lineChartScaleY(d.relativeOccurences));

    //let test = lineChartSvg.selectAll(".lines");

    // binding data
    let lines = lineChartSvg.selectAll(".lines").selectAll('.line') // TODO: I dont get, why I cannot assign lines to lineGroup
        .data(data);

    lines.enter()
        .append('path')
        .attr('class', 'line')
        .attr('id', d => {return ('lineForWord'+ d.word)})
        .style('stroke', (d, i) => lookUpColor(d.word))
        .style('opacity', lineOpacity)
        .on("mouseover", function(d) {
            lineChartSvg.append("text")
                    .attr("class", "title-text")
                    .style('fill', lookUpColor(d.word)) // TODO: don't assign color, but do a color assigner at the end
                    // according to id!
                    .text(d.word)
                    .attr("text-anchor", "middle")
                    .attr("x", (lineChartWidth)/2)
                    .attr("y", -20);
            highlightSelectedLine(this) // avoiding arrow notation but rather using ES5 notation to grab 'this' ->
            // https://medium.freecodecamp.org/when-and-why-you-should-use-es6-arrow-functions-and-when-you-shouldnt-3d851d7f0b26
        })
        .on("mouseout", function() {
            lineChartSvg.select(".title-text").remove();
            highlightOutSelectedLine(this);
        })
        .merge(lines)
        .transition()
        .attr('d', d => line(d.values))
    ;

    lines.exit().remove();

    // TODO: Here's the problem!
    // binding data
    let circleGroup = lineChartSvg.selectAll('.lines').selectAll('.circle-group')
        .data(data);

    // create a circle group for each element, i.e. distinct word in data
    circleGroup.enter()
        .append('g')
        .attr("class","circle-group")
        .style("fill", (d) => {return ( lookUpColor(d.word) )});

    console.log(circleGroup);
    let circle = circleGroup.selectAll("circle")
        .data(d => {console.log(d.values); return d.values});

    circle.enter()
        .append('circle')
        .merge(circle)
        .transition()
        .attr("cx", d => lineChartScaleX(d.date))
        .attr("cy", d => lineChartScaleY(d.relativeOccurences))
        .attr("r", circleRadius)
        .style('opacity', circleOpacity);

    circleGroup.exit().remove();
    //circle.exit().remove();

    /* Add circles in the line */
    /*linegroup.selectAll("circle-group")
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
                //.transition()
                .duration(duration)
                .attr("r", circleRadius);
        });*/

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

function highlightSelectedLine (htmlElementID) {

    console.log(htmlElementID);
    d3.selectAll('.line')
        .style('opacity', otherLinesOpacityHover);
    d3.selectAll('.circle')
        .style('opacity', circleOpacityOnLineHover);
    d3.select(htmlElementID)
        .style('opacity', lineOpacityHover)
        .style("stroke-width", lineStrokeHover)
        .style("cursor", "pointer");
}

function highlightOutSelectedLine (htmlElementID) {
    d3.selectAll(".line")
        .style('opacity', lineOpacity);
    d3.selectAll('.circle')
        .style('opacity', circleOpacity);
    d3.select(htmlElementID)
        .style("stroke-width", lineStroke)
        .style("cursor", "none");
}



