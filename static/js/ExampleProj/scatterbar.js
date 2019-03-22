// initializing ScatterBarCarts for sender and recipient
function initScatterBarCharts(){

    // margin conventions
    let margin = {top: 10, right: 20, bottom: 40, left: 20};
    scatterBarWidth = $("#sender").width() - margin.left - margin.right;
    scatterBarHeight = 130 - margin.top - margin.bottom;

    // initialize sender chart
    scatterBarSenderSVG = d3.select("#sender").append("svg")
        .attr("width", scatterBarWidth + margin.left + margin.right)
        .attr("height", scatterBarHeight + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // initialize recipient chart
    scatterBarRecipientSVG = d3.select("#recipient").append("svg")
        .attr("width", scatterBarWidth + margin.left + margin.right)
        .attr("height", scatterBarHeight + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
}

console.log('initializing ScatterBarCharts');
initScatterBarCharts();


// updating ScatterBarCharts at appropriate svgID, with filteredData, providing new range
function updateScatterBarChart(svgID,data,range,senderID,recipientID){

    // console.log('updating ScatterBarChart with following info', svgID, data, range, senderID, recipientID);
    let parseTime = d3.timeParse("%d-%b-%Y");

    // create empty array for relevant letters
    let relevantLetters = [];

    // filter the data for sender-recipient-pair
    data.forEach(function (d) {
        if(d.senderID === parseInt(senderID) && d.recipientID === parseInt(recipientID)){
            relevantLetters.push(d);
        }
    });

    // set ranges
    let xScale = d3.scaleTime()
        .range([0, scatterBarWidth]);

    let yScale = d3.scaleLinear()
        .domain([0,400])
        .range([0, scatterBarHeight]);

    // Define the axes
    let xAxis = d3.axisBottom().scale(xScale);
    let yAxis = d3.axisLeft().scale(yScale).ticks(5);

    // Scale the range of the data - as range comes as [Year, Year] we need to parseYear
    let parseYear = d3.timeParse("%Y");
    xScale.domain([parseYear(range[0]),parseYear(range[1])]);

    // append x axis
    svgID.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", "translate(0," + scatterBarHeight +")");

    svgID.select(".x-axis")
        .transition()
        .call(xAxis);

    svgID.append("g")
        .attr("transform", "translate(0, "+yScale(200)+")")
        .append("line")
        .attr("x2", scatterBarWidth)
        .style("stroke", "#cccccc")
        .style("stroke-width", "1px");

    svgID.append("g")
        .attr('class', 'd3text')
        .attr("transform", "translate(0, "+yScale(188)+")")
        .append("text")
        .text('200 words');


    // append scatterbars
    let scatterBars = svgID
        .selectAll("rect")
        .data(relevantLetters);
    scatterBars
        .enter().append("rect")
        .merge(scatterBars)
        .attr("class", 'scatterbars')
        .style('fill', function (d) {
            return colorScale(d.sentiment)
        })
        .on("mouseover", function(d){
            d3.select(this).style("fill", "rgba(0, 0, 0, 1)")
        })
        .on("mouseout", function(){
            d3.select(this).style('fill', function (d) {
                return colorScale(d.sentiment)
            })
        })
        .on("click", function (d) {
        })
        .transition()


        .attr("width", 5)
        .attr("height", function (d) {
            return(yScale(d.letterLength))
        })
        .attr("x", function (d) {
            return (xScale(d.date))
        })
        .attr("y", function(d) {
            return (scatterBarHeight - yScale(d.letterLength))
        });

        scatterBars.exit().remove();

}


function colorScale(sentiment) {
    console.log(sentiment);
    if(sentiment > 0 && sentiment <= .2){
        return "rgba(55, 130, 15, 0.6)"
    }
    else if (sentiment > .2 && sentiment <= .4){
        return "rgba(55, 130, 15, 0.72)"
    }
    else if (sentiment > .4 && sentiment <= .6){
        return "rgba(55, 130, 15, 0.85)"
    }
    else if (sentiment > .6 && sentiment <= 1){
        return "rgba(55, 130, 15, 1)"
    }
    if(sentiment <= 0 && sentiment >= -.2){
        return "#rgba(143, 43, 43, 0.3)"
    }
    else if (sentiment < -.2 && sentiment >= -.4){
        return "rgba(143, 43, 43, 0.5)"
    }
    else if (sentiment < -.4 && sentiment >= -.6){
        return "rgba(143, 43, 43, 0.7)"
    }
    else if (sentiment < .6 && sentiment >= -1){
        return "rgba(143, 43, 43, 1)"
    }
}


