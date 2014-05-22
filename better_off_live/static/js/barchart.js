$( function() {

    var chart,
        bars,
        w = 8,
        h = 500,
        x, y,
        xAxis, yAxis;

    var margin = {top: 50, right: 50, bottom: 50, left: 50},
    width = Math.min(document.getElementById("maindiv").offsetWidth, 800) - margin.left - margin.right,
    height = width*.67 - margin.top - margin.bottom;


    var tip = d3.tip()
	.attr('class', 'd3-tip')
	.offset([-10, 0])
	.html(function(d) {
	    if (d.score > 0) {
		var color = 'orange';
	    } else {
		var color = 'red';
	    }
	    return "<p><span style='font-size:18px;'>" + d.title + "</span></p>\
<p>Live hotttnesss: <span style='color:" + color + "'>" + Math.round(d.live_value * 100) / 100 + "</span></p>\
<p>Regular hotttnesss: <span style='color:" + color + "'>" + Math.round(d.regular_value * 100) / 100 + "</span></p>\
<p>Score: <span style='color:" + 'magenta' + "'>" + Math.round(d.score * 100) / 100 + "</span></p>";
	})

    chart = d3.select( '#maindiv' ).append( 'svg' )
	.attr( 'class', 'chart' )
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
        .append('g');

    d3.select('svg g')
        .attr('transform', 'translate(50, 50)');
    
    chart.call(tip);


    x = d3.scale.ordinal()
	.domain(data.map(function(d) { return d.title; }))
	.rangeRoundBands([0, width], .1);

    console.log(data.map(function(d) { return d.title; }));

    y = d3.scale.linear()
	.domain([-1, 1])
	.range([height, 0]);

    bars = chart.append('g')
        .attr('class', 'bars');

    xAxis = d3.svg.axis()
        .scale(x)
        .ticks(20)
	.orient("top");

    yAxis = d3.svg.axis()
        .scale(y)
        .ticks(0)
        .orient("left");

    chart.append('g')
        .attr('class', 'x axis')
        .call(xAxis)
    .selectAll(".tick text")
	.style("font-size","0.9em")
	.style("font-weight","bold")
	.call(wrap, x.rangeBand());


    // y-axis labels
    chart.append("text")
	.attr("class", "y label")
	.attr("text-anchor", "end")
	.attr("y", y(0.5))
	.attr("dy", 1)
	.text("Better live");

    chart.append("text")
	.attr("class", "y label")
	.attr("text-anchor", "end")
	.attr("y", y(-0.5))
	.attr("dy", 1)
	.text("Better not live");

    chart.append('g')
        .attr('class', 'y axis')
        .call(yAxis);

    chart
	.selectAll(".label")
	.call(wrap, 1);

    // baseline (thru y = 0)
    var myLine = chart.append("svg:line")
	.attr("x1", x(0))
	.attr("y1", y(0))
	.attr("x2", width)
	.attr("y2", y(0))
	.style("stroke", "rgb(200,200,200")
	.style("stroke-dasharray", ("4, 2"))
	.style("stroke-width", 2);

    // bars
    chart.selectAll(".bar")
	.data(data)
	.enter().append("rect")
	.attr("class", function(d) { return d.score < 0 ? "bar negative" : "bar positive"; })
	.attr("x", function(d) { return x(d.title); })
	.attr("y", function(d) { return y(Math.max(d.score, 0)); })
	.attr('height', function(d) { 
	    if (d.score < 0) { return y(1+d.score) } 
	    else { return y(1-d.score) }; })
	.attr("width", x.rangeBand())
	.on('mouseover', tip.show)
	.on('mouseout', tip.hide);


// Wrap x-axis labels so they don't overlap
// From http://bl.ocks.org/mbostock/7555321
function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}


});
