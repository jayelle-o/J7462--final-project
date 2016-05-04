
/* ---------------------- */
/* GLOBAL VARIABLES */
/* ---------------------- */



// We use the margins to offset the chartable space inside of the <svg> space.
// A great visual explanation of how this works is here: https://bl.ocks.org/mbostock/3019563
var margin = {
        top: 20,
        right: 120,
        bottom: 120,
        left: 20
    };

// Here, we define the width and height as that of the .chart div minus the margins.
// We do this to make sure our chart is responsive to the browser width/height
var width = $(".chart").width() - margin.left - margin.right;
var height = $(".chart").height() - margin.top - margin.bottom;

//parse the date
var parseDate = d3.time.format("%Y-%m").parse;

// `x` and `y` are scale function. We'll use this to translate values from the data into pixels.
var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1); //Range is an array of two *pixel* values.

var y = d3.scale.linear()
    .range([height, 0]);

// `xAxis` and `yAxis` are functions as well.
// We'll call them later in the code, but for now, we just want to assign them some properties:
// Axis have to abide by their scales: `x` and `y`. So we pass those to the axis functions.
// And we use the orient property to determine where the hashes and number labels show up.
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickFormat(function(d) {
        console.log(d);
        var month = d.split("-")[1];
        var year = d.split("-")[0];

        console.log(month);
        if (month == "01") {
            return year;
        }
    });

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("right");

// We define svg as a variable here. It's a variable, so we could call it anything. So don't be confused by it being named the same as the tag.
var svg = d3.select(".chart").append("svg") // Appends the <svg> tag to the .chart div
	.attr("class", "parent-svg") // gives it class
    .attr("width", width + margin.left + margin.right) //gives the <svg> tag a width
    .attr("height", height + margin.top + margin.bottom) //gives the <svg> tag a height
    .append("g") // Appends a <g> (Group) tag to the <svg> tag. This will hold the actual chartspace.
    .attr("class", "chart-g") //assigns the <g> tag a class
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")"); //Offsets the .chart-g <g> element by the values left and top margins. Basically the same as a left/right position.


/* END GLOBAL VARIABLES ---------------------- */


/* ---------------------- */
/* LOAD THE DATA */
/* ---------------------- */

// This is an ajax call. Same as when we load a json file.
d3.csv("data/output_20160502.csv", function(error, data) {
    if (error) throw error;



    // Get the month values from the data.
    var monthDomain = data.map(function(d) { return d.month; })

    // Get the incidentCounts value from the data
	var incidents = d3.extent(data, function(d) {
        return +d.incidents;
    });


    // `minMaxParticipation` is an ARRAY OF TWO VALUES.
    // We'll assign it to the "domain" of the `x` scale. 
    // x.domain(minMaxParticipation).nice();
 	x.domain(monthDomain);
           
    // // Same for the `x` scale.

    y.domain(incidents).nice();


 	// This is where we call the axis functions.
    //   We do so by first giving it someplace to live. In this case, a new <g> tag with the class names `x` and `axis.`
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")") //Assigns a left/right position.
        .call(xAxis) // This calls the axis function, which builds the axis inside the <g> tag.
        .selectAll("text")
        .attr("y", 20)
        .attr("dx", 0)
        .attr("dy", ".35em")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");
        //.text("xxxxx")

    // Same as above, but for the y axis.
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + width + ", 0)")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", -16)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("oilfield incidents");

    svg.selectAll(".bar") //bar doesn't exist yet
    .data(data)
    .enter().append("rect") 
    .attr("class", "bar")
    .attr("x", function(d) { 
        return x(d.month); 
    })
    .attr("width", x.rangeBand())
    .attr("y", function(d) { 
        return y(d.incidents); 
    })
    .attr("height", function(d) { 
        return height - y(d.incidents); 
    })

    .on("mouseover", function(d) {

        var num = d.incidents;
        var date = d.month;

        $(".tt").html(
            "<div class='month'>"+num+"</div>"+
            "<div class='incidents'>"+date+"</div>"
        )

        $(".tt").show();

        d3.select(this).attr("fill", "orange");

    })
    
    .on("mousemove", function(d) {
        
        var xPos = d3.mouse(this)[0] + margin.left + 10;
        var yPos = d3.mouse(this[1] + margin.top + 10);

        $(".tt").css({
            "left" : xPos + "px",
            "top" : yPos + "px"
        })
    })
    
    .on("mouseout", function(d){
        d3.select(this).style("fill", "black");
        $(".tt").hide();
    })
    
});



