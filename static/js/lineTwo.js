
// use a function to wrangle lineChart data
async function wrangleLineChartData(ArrayOfLockedWords, data) {

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

        // loop through all environments and fill the temporary helperStructure with correct count
        text.environments.forEach( environment => {
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
                    date: dateOfText
                }
            )})
    });

    //
    let wrangledData = [];
    // finale struktur vorbereiten!
    keywords.forEach(keyword => {
        let wordValues = [];
        tmpOverall.forEach( element => {
            if (keyword === element.word){
                let tmp = {
                    date: element.date,
                    occurences: element.value

                };
                wordValues.push(tmp)
            }
        });

        //
        let superTmp = {
            word : keyword,
            values: wordValues
        };

        wrangledData.push(superTmp)
    });

    console.log('FINALE', wrangledData);
    drawLineChart (wrangledData);
}




function drawLineChart (data) {

    $("#lineChartSVG").html('');

// margin conventions
    let lineMargins = {
        top: 50,
        right: 50,
        bottom: 20,
        left: 50
    };
    let width = $("#lineChartSVG").width() - lineMargins.right - lineMargins.right;
    let height = $("#lineChartSVG").height() - lineMargins.top - lineMargins.bottom;

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


    /* Scale */
    let xScale = d3.scaleTime()
        .domain(d3.extent(data[0].values, d => d.date))
        .range([0, width]);

    let yScale = d3.scaleLinear()
        .domain([0, d3.max(data[0].values, d => d.occurences)])
        .range([height, 0]);

    // TODO kann bald geloescht werden!
    let colorLine = d3.scaleOrdinal(d3.schemeCategory10);

    /* Add SVG */
    let svg = d3.select("#LineChartSVG").append("svg")
        .attr("width", $("#lineChartSVG").width() + lineMargins.left + lineMargins.right)
        .attr("height", $("#lineChartSVG").height() + lineMargins.top + lineMargins.bottom)
        .append('g')
        .attr("transform", "translate(" + lineMargins.left + "," + lineMargins.top + ")");


    /* Add line into SVG */
    let line = d3.line()
        .x(d => xScale(d.date))
        .y(d => yScale(d.occurences));

    let lines = svg.append('g')
        .attr('class', 'lines');

    // draw the lines
    lines.selectAll('.line-group')
        .data(data).enter()
        .append('g')
        .attr('class', 'line-group')
        .on("mouseover", function(d, i) {
            svg.append("text")
                .attr("class", "title-text")
                .style("fill", colorLine(i))
                .text(d.word)
                .attr("text-anchor", "middle")
                .attr("x", (width)/2)
                .attr("y", 5);
        })
        .on("mouseout", function(d) {
            svg.select(".title-text").remove();
        })
        .append('path')
        .attr('class', d => {return 'line '}) // TODO use this class!
        .attr('d', d => line(d.values))
        .style('stroke', (d, i) => lookUpColor(d.word))
        .style('opacity', lineOpacity)
        .on("mouseover", function(d) {
            d3.selectAll('.line')
                .style('opacity', otherLinesOpacityHover);
            d3.selectAll('.circle')
                .style('opacity', circleOpacityOnLineHover);
            d3.select(this)
                .style('opacity', lineOpacityHover)
                .style("stroke-width", lineStrokeHover)
                .style("cursor", "pointer");
        })
        .on("mouseout", function(d) {
            d3.selectAll(".line")
                .style('opacity', lineOpacity);
            d3.selectAll('.circle')
                .style('opacity', circleOpacity);
            d3.select(this)
                .style("stroke-width", lineStroke)
                .style("cursor", "none");
        });



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
                .text(`${d.occurences}`)
                .attr("x", d => xScale(d.date) + 5)
                .attr("y", d => yScale(d.occurences) - 10);
        })
        .on("mouseout", function(d) {
            d3.select(this)
                .style("cursor", "none")
                .transition()
                .duration(duration)
                .selectAll(".text").remove();
        })
        .append('circle')
        .attr("cx", d => xScale(d.date))
        .attr("cy", d => yScale(d.occurences))
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
    let xAxis = d3.axisBottom(xScale).ticks(5);
    let yAxis = d3.axisLeft(yScale).ticks(5);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append('text')
        .attr("y", 15)
        .attr("transform", "rotate(-90)")
        .attr("fill", "#000")
        .text("Total values");

}



