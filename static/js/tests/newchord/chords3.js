/*** Define parameters and tools ***/
var width = 760,
    height = 820,
    outerRadius = Math.min(width, height) / 2 - 120,//100,
    innerRadius = outerRadius - 10;

var dataset = "foursix.json";
//string url for the initial data set
//would usually be a file path url, here it is the id
//selector for the <pre> element storing the data

//create number formatting functions
var formatPercent = d3.format("%");
var numberWithCommas = d3.format("0,f");

//create the arc path data generator for the groups
var arc = d3.svg.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);

//create the chord path data generator for the chords
var path = d3.svg.chord()
    .radius(innerRadius - 4);// subtracted 4 to separate the ribbon

//define the default chord layout parameters
//within a function that returns a new layout object;
//that way, you can create multiple chord layouts
//that are the same except for the data.
function getDefaultLayout() {
    return d3.layout.chord()
        .padding(0.03)
        .sortSubgroups(d3.descending)
        .sortChords(d3.ascending);
}
var last_layout; //store layout between updates
var regions; //store neighbourhood data outside data-reading function

/*** Initialize the visualization ***/
var g = d3.select("#chart_placeholder").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("id", "circle")
    .attr("transform",
        "translate(" + width / 2 + "," + height / 2 + ")");
//the entire graphic will be drawn within this <g> element,
//so all coordinates will be relative to the center of the circle

g.append("circle")
    .attr("r", outerRadius);
//this circle is set in CSS to be transparent but to respond to mouse events
//It will ensure that the <g> responds to all mouse events within
//the area, even after chords are faded out.

/*** Read in the neighbourhoods data and update with initial data matrix ***/
//normally this would be done with file-reading functions
//d3. and d3.json and callbacks,
//instead we're using the string-parsing functions
//d3.csv.parse and JSON.parse, both of which return the data,
//no callbacks required.


d3.csv("regionsfish.csv", function(error, regionData) {

    if (error) {alert("Error reading file: ", error.statusText); return; }

    regions = regionData;
    //store in variable accessible by other functions


    //regions = d3.csv.parse(d3.select("#regions").text());
    //instead of d3.csv

    updateChords(dataset);
    //call the update method with the default dataset

}); //end of d3.csv function


/* Create OR update a chord layout from a data matrix */
function updateChords( datasetURL ) {

    d3.json(datasetURL, function(error, matrix) {

        if (error) {alert("Error reading file: ", error.statusText); return; }

        //var matrix = JSON.parse( d3.select(datasetURL).text() );
        // instead of d3.json


        /* Compute chord layout. */
        layout = getDefaultLayout(); //create a new layout object
        layout.matrix(matrix);


        /* Create/update "group" elements */
        var groupG = g.selectAll("g.group")
            .data(layout.groups(), function (d) {
                console.log(layout.groups(), d.index);
                return d.index;
                //use a key function in case the
                //groups are sorted differently
            });

        groupG.exit()
            .transition()
            .duration(1500)
            .attr("opacity", 0)
            .remove(); //remove after transitions are complete

        var newGroups = groupG.enter().append("g")
            .attr("class", "group");
        //the enter selection is stored in a variable so we can
        //enter the <path>, <text>, and <title> elements as well


        //Create the title tooltip for the new groups
        newGroups.append("title");

        //Update the (tooltip) title text based on the data
        groupG.select("title")
            .text(function(d, i) {
                return numberWithCommas(d.value)
                    + " x (10\u00B3) in USD exports from "
                    + regions[i].name;
            });

        //create the arc paths and set the constant attributes
        //(those based on the group index, not on the value)
        newGroups.append("path")
            .attr("id", function (d) {
                return "group" + d.index;
                //using d.index and not i to maintain consistency
                //even if groups are sorted
            })
            .style("fill", function (d) {
                return regions[d.index].color;
            });

        //update the paths to match the layout
        groupG.select("path")
            .transition()
            .duration(1500)
            //.attr("opacity", 0.5) //optional, just to observe the transition////////////
            .attrTween("d", arcTween( last_layout ))
        // .transition().duration(100).attr("opacity", 1) //reset opacity//////////////
        ;


    }); //end of d3.json
}

function arcTween(oldLayout) {
    //this function will be called once per update cycle

    //Create a key:value version of the old layout's groups array
    //so we can easily find the matching group
    //even if the group index values don't match the array index
    //(because of sorting)
    var oldGroups = {};
    if (oldLayout) {
        oldLayout.groups().forEach( function(groupData) {
            oldGroups[ groupData.index ] = groupData;
        });
    }

    return function (d, i) {
        var tween;
        var old = oldGroups[d.index];
        if (old) { //there's a matching old group
            tween = d3.interpolate(old, d);
        }
        else {
            //create a zero-width arc object
            var emptyArc = {startAngle:d.startAngle,
                endAngle:d.startAngle};
            tween = d3.interpolate(emptyArc, d);
        }

        return function (t) {
            return arc( tween(t) );
        };
    };
}

function chordKey(data) {
    return (data.source.index < data.target.index) ?
        data.source.index  + "-" + data.target.index:
        data.target.index  + "-" + data.source.index;

    //create a key that will represent the relationship
    //between these two groups *regardless*
    //of which group is called 'source' and which 'target'
}
function chordTween(oldLayout) {
    //this function will be called once per update cycle

    //Create a key:value version of the old layout's chords array
    //so we can easily find the matching chord
    //(which may not have a matching index)

    var oldChords = {};

    if (oldLayout) {
        oldLayout.chords().forEach( function(chordData) {
            oldChords[ chordKey(chordData) ] = chordData;
        });
    }

    return function (d, i) {
        //this function will be called for each active chord

        var tween;
        var old = oldChords[ chordKey(d) ];
        if (old) {
            //old is not undefined, i.e.
            //there is a matching old chord value

            //check whether source and target have been switched:
            if (d.source.index != old.source.index ){
                //swap source and target to match the new data
                old = {
                    source: old.target,
                    target: old.source
                };
            }

            tween = d3.interpolate(old, d);
        }
        else {
            //create a zero-width chord object
///////////////////////////////////////////////////////////in the copy ////////////////
            if (oldLayout) {
                var oldGroups = oldLayout.groups().filter(function(group) {
                    return ( (group.index == d.source.index) ||
                        (group.index == d.target.index) )
                });
                old = {source:oldGroups[0],
                    target:oldGroups[1] || oldGroups[0] };
                //the OR in target is in case source and target are equal
                //in the data, in which case only one group will pass the
                //filter function

                if (d.source.index != old.source.index ){
                    //swap source and target to match the new data
                    old = {
                        source: old.target,
                        target: old.source
                    };
                }
            }
            else old = d;
            /////////////////////////////////////////////////////////////////
            var emptyChord = {
                source: { startAngle: old.source.startAngle,
                    endAngle: old.source.startAngle},
                target: { startAngle: old.target.startAngle,
                    endAngle: old.target.startAngle}
            };
            tween = d3.interpolate( emptyChord, d );
        }

        return function (t) {
            //this function calculates the intermediary shapes
            return path(tween(t));
        };
    };
}


/* Activate the buttons and link to data sets */
d3.select("#foursix").on("click", function () {
    updateChords( "foursix.json" );
    //replace this with a file url as appropriate

    //enable other buttons, disable this one
    // disableButton(this);
});

d3.select("#sevennine").on("click", function() {
    updateChords( "sevennine.json" );
    // disableButton(this);
});

d3.select("#tentwelve").on("click", function() {
    updateChords( "tentwelve.json" );
    //disableButton(this);
});

d3.select("#thirteenfiveteen").on("click", function() {
    updateChords( "thirteenfiveteen.json" );
    //disableButton(this);
});
/*
function disableButton(buttonNode) {
    d3.selectAll("button")
        .attr("disabled", function(d) {
            return this === buttonNode? "true": null;
        });
}
*/