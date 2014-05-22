$( function() {
    /*
    var json = [
        {
            "Year": "2044",
            "Population": "9,017,181,494",
            "Annual growth rate (%)": "0.52",
            "Population change": "46,926,143"
        },
        {
            "Year": "2045",
            "Population": "9,064,107,637",
            "Annual growth rate (%)": "0.51",
            "Population change": "45,941,983"
        },
        {
            "Year": "2046",
            "Population": "9,110,049,620",
            "Annual growth rate (%)": "0.49",
            "Population change": "44,990,101"
        },
        {
            "Year": "2047",
            "Population": "9,155,039,721",
            "Annual growth rate (%)": "0.48",
            "Population change": "44,017,110"
        },
        {
            "Year": "2048",
            "Population": "9,199,056,831",
            "Annual growth rate (%)": "0.47",
            "Population change": "43,026,715"
        },
        {
            "Year": "2049",
            "Population": "9,242,083,546",
            "Annual growth rate (%)": "0.45",
            "Population change": "42,023,878"
        }
    ];
*/

    var data = [{ 'title': 'Some song',
		  'score': 0.582 
		},
		{ 'title': 'Another song',
		  'score': 0.954
		},
		{ 'title': 'Song 3',
		  'score': 0.105
		}]


    var results,
        //data = [],
        chart,
        bars,
        margin = 100,
        w = 8,
        h = 500,
        x, y,
        xAxis, yAxis;

    //results = d3.map( json );
    /*results.forEach( function( key, val ) {
        var result = {};
        result.year = new Date(parseInt( val.Year, 10 ), 0, 1);
        result.population = parseInt( val.Population.replace( /,/g, '' ), 10 );
        data.push( result );
    } );
    */
    chart = d3.select( 'body' ).append( 'svg' )
        .attr( 'class', 'chart' )
        .attr( 'width', 1100 )
        .attr( 'height', h )
        .append('g');

    d3.select('svg g')
        .attr('transform', 'translate(50, 50)');

    x = d3.scale.ordinal()
	.domain(data.map(function(d) { return d.title; }));
	.rangeRoundBands([0, width], .1);

    y = d3.scale.linear();
	.domain([0, d3.max(data, function(d) { return d.score; })]);
        //.rangeRound( [0, h - margin] );

    // Bars
    bars = chart.append('g')
        .attr('class', 'bars');

    bars.selectAll( 'rect' )
        .data( data )
      .enter().append( 'rect' )
        .attr( 'x', function( d, i ) { return 1 } )
        .attr( 'y', function( d ) { return d.score } )
        .attr( 'width', w )
        .attr( 'height', function( d ) { return y( d.score ) } )
        .append('g');

    // Axis
    xAxis = d3.svg.axis()
        .scale(x)
        .ticks(20)
        .tickSize(6, 3, 1);

    yAxis = d3.svg.axis()
        .scale(y)
        .tickSize(6, 3, 1)
        .orient('right');

    chart.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0, ' + (h - margin) + ')')
        .call(xAxis);

    chart.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(' + x.range()[1] + ')')
        .call(yAxis);


    chart.selectAll(".bar")
	.data(data)
	.enter().append("rect")
	.attr("class", "bar")
	.attr("x", function(d) { return x(d.name); })
	.attr("y", function(d) { return y(d.value); })
	.attr("height", function(d) { return height - y(d.value); })
	.attr("width", x.rangeBand());
});

} );
