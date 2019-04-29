let tmpLineChartData = [];

async function wrangleLineChartData(ArrayOfLockedWords, myData) {

    // reset tmpLineChartData for each instance you run wrangleLineChartData()
    tmpLineChartData = [];

    // grab currently lockedWords and store them in 'selected'
    let selected = lockedWords;

    // Analyze the data by looping through the corpus.
    myData.data.data.forEach( d => {

        // for each text in the corpus, create a temporary, empty data structure
        let tmpDict = {};
        selected.forEach(d => {
            if (d !== ""){
                tmpDict[d] = 0;
            }
        });

        // next, loop over all relevant environments that were found in that text
        d.environments.forEach( environment => {

            // for all the words in the selected Array test the following:
            selected.forEach( word => {

                // if word in environment
                if (environment.includes(word)){

                    // tick up accordingly
                    tmpDict[word] += 1;
                }
            });
        });

        // add time to data entry
        tmpDict['date'] = d.year + '0101';

        // adding tmpDict to tmpLineChartData
        tmpLineChartData.push(tmpDict);
        });

    console.log('data for LineChart:', tmpLineChartData);
    updateLineChart (tmpLineChartData);
}



// D3 margin conventions
let margin = {
        top: 30,
        right: 80,
        bottom: 50,
        left: 50
    },
    width = $("#lineChartSVG").width() - margin.left - margin.right,
    height = $("#lineChartSVG").height() - margin.top - margin.bottom;

let parseDate = d3.timeParse("%Y%m%d");

let x = d3.scaleTime()
    .range([0, width]);

let y = d3.scaleLinear()
    .range([height, 0]);

let color = d3.scaleOrdinal(d3.schemeCategory10);

let xAxis = d3.axisBottom(x),
    yAxis = d3.axisLeft(y);

let line = d3.line()
    .x(function(d) {
        return x(d.date);
    })
    .y(function(d) {
        return y(d.value);
    })
    .curve(d3.curveMonotoneX);

let svg = d3.select("#lineChartSVG").append("svg")
    .attr("width",  width + margin.left + margin.right)
    .attr("height",  height+ margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");




// UPDATE
function updateLineChart (data) {

    console.log('hier herausfinden, wie viele lines es gibt', data);

    let color = d3.scaleOrdinal(colors);

    color.domain(d3.keys(data[0]).filter(function(key) {
        return key !== "date";
    }));

// get dates into correct format
    data.forEach(function(d) {
        d.date = parseDate(d.date);
    });

    let cities = color.domain().map(function(name) {
        return {
            name: name,
            values: data.map(function(d) {
                return {
                    date: d.date,
                    value: +d[name]
                };
            })
        };
    });

    x.domain(d3.extent(data, function(d) {
        return d.date;
    }));

    y.domain([0,
        d3.max(cities, function(c) {
            console.log('hello', c);
            return d3.max(c.values, function(v) {
                console.log(v);
                return v.value;
            });
        })
    ]);

// x axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("x", width)
        .attr("dy", "-.71em")
        .style("text-anchor", "end")
        .style('stroke', 'grey')
        .text("time");

// y axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .style('stroke', 'grey')
        .text("word occurences");


// prepare paths
    let city = svg.selectAll(".city")
        .data(cities)
        .enter()
        .append("g")
        .attr("class", "city");

    city.exit().remove();

    city.append("path")
        .attr("class", "line")
        .attr("d", function(d) {
            return line(d.values);
        })
        .style("stroke", function(d,i) {
            return colors[i]; //TODO: If this doesn't work, we can also look up the color for the current word.
        });

// looking up the last datum and adding text at that position
    city.append("text")
        .datum(function(d) {
            return {
                name: d.name,
                value: d.values[d.values.length - 1]
            };
        })
        .attr("transform", function(d) {
            return "translate(" + x(d.value.date) + "," + y(d.value.value) + ")";
        })
        .attr("x", 3)
        .attr("dy", ".35em")
        .text(function(d) {
            return d.name;
        });



// append layer for mouse over effect
    let mouseG = svg.append("g")
        .attr("class", "mouse-over-effects");

    mouseG.append("path") // this is the black vertical line to follow mouse
        .attr("class", "mouse-line")
        .style("stroke", "black")
        .style("stroke-width", "1px")
        .style("opacity", "0");

    let lines = document.getElementsByClassName('line');

    let mousePerLine = mouseG.selectAll('.mouse-per-line')
        .data(cities)
        .enter()
        .append("g")
        .attr("class", "mouse-per-line");

    mousePerLine.append("circle")
        .attr("r", 7)
        .style("stroke", function(d) {
            return color(d.name);
        })
        .style("fill", "none")
        .style("stroke-width", "1px")
        .style("opacity", "0");

    mousePerLine.append("text")
        .attr("transform", "translate(10,3)");

    mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
        .attr('width', width) // can't catch mouse events on a g element
        .attr('height', height)
        .attr('fill', 'none')
        .attr('pointer-events', 'all')
        .on('mouseout', function() { // on mouse out hide line, circles and text
            d3.select(".mouse-line")
                .style("opacity", "0");
            d3.selectAll(".mouse-per-line circle")
                .style("opacity", "0");
            d3.selectAll(".mouse-per-line text")
                .style("opacity", "0");
        })
        .on('mouseover', function() { // on mouse in show line, circles and text
            d3.select(".mouse-line")
                .style("opacity", "1");
            d3.selectAll(".mouse-per-line circle")
                .style("opacity", "1");
            d3.selectAll(".mouse-per-line text")
                .style("opacity", "1");
        })
        .on('mousemove', function() { // mouse moving over canvas
            let mouse = d3.mouse(this);
            d3.select(".mouse-line")
                .attr("d", function() {
                    let d = "M" + mouse[0] + "," + height;
                    d += " " + mouse[0] + "," + 0;
                    return d;
                });

            d3.selectAll(".mouse-per-line")
                .attr("transform", function(d, i) {
                    //console.log(width/mouse[0])
                    let xDate = x.invert(mouse[0]),
                        bisect = d3.bisector(function(d) { return d.date; }).right;
                    idx = bisect(d.values, xDate);

                    let beginning = 0,
                        end = lines[i].getTotalLength(),
                        target = null;

                    while (true){
                        target = Math.floor((beginning + end) / 2);
                        pos = lines[i].getPointAtLength(target);
                        if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                            break;
                        }
                        if (pos.x > mouse[0])      end = target;
                        else if (pos.x < mouse[0]) beginning = target;
                        else break; //position found
                    }

                    d3.select(this).select('text')
                        .text(y.invert(pos.y).toFixed(2));

                    return "translate(" + mouse[0] + "," + pos.y +")";
                });
        });
}
