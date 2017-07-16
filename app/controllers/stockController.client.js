'use strict';

(function(){

  // $("#venue-search-form").submit(function(event){
  //   event.preventDefault();
  //   getPlaces();
  // });

  var svg = d3.select("svg"),
    margin = {top: 20, right: 80, bottom: 30, left: 50},
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var parseTime = d3.timeParse("%Y%m%d");

  var x = d3.scaleTime().range([0, width]),
      y = d3.scaleLinear().range([height, 0]),
      z = d3.scaleOrdinal(d3.schemeCategory10);

  var line = d3.line()
      .curve(d3.curveBasis)
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.temperature); });

  $.ajax({
    type: 'GET',
    url: 'https://www.alphavantage.co/query',
    data: {
      function: 'TIME_SERIES_DAILY',
      symbol: 'AMZN',
      apikey: 'Y0W8FJVMBZ4PGPYU'
    },
    success: function(response) {
      var obj = response['Time Series (Daily)'];
      var result = getDailyData(obj);
      result = result.slice(50,result.length);

      svg.append("g")
              .attr("class", "candlestickS");

      svg.selectAll("g.candlestickS").datum(result).call(candlestick);
    },
  });

  d3.tsv("data.tsv", type, function(error, data) {
    if (error) throw error;

    var cities = data.columns.slice(1).map(function(id) {
      return {
        id: id,
        values: data.map(function(d) {
          return {date: d.date, temperature: d[id]};
        })
      };
    });

    x.domain(d3.extent(data, function(d) { return d.date; }));

    y.domain([
      d3.min(cities, function(c) { return d3.min(c.values, function(d) { return d.temperature; }); }),
      d3.max(cities, function(c) { return d3.max(c.values, function(d) { return d.temperature; }); })
    ]);

    z.domain(cities.map(function(c) { return c.id; }));

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y))
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("fill", "#000")
        .text("Temperature, ºF");

    var city = g.selectAll(".city")
      .data(cities)
      .enter().append("g")
        .attr("class", "city");

    city.append("path")
        .attr("class", "line")
        .attr("d", function(d) { return line(d.values); })
        .style("stroke", function(d) { return z(d.id); });

    city.append("text")
        .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
        .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")"; })
        .attr("x", 3)
        .attr("dy", "0.35em")
        .style("font", "10px sans-serif")
        .text(function(d) { return d.id; });
  });

  function type(d, _, columns) {
    d.date = parseTime(d.date);
    for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
    return d;
  }

  // var otherHalf
  //
  // var margin = {top: 20, right: 20, bottom: 30, left: 50},
  //             width = 960 - margin.left - margin.right,
  //             height = 500 - margin.top - margin.bottom;
  //
  // // var parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S");
  // var parseDate = d3.timeParse("%Y-%m-%d");
  //
  // var x = techan.scale.financetime()
  //         .range([0, width]);
  //
  // var y = d3.scaleLinear()
  //         .range([height, 0]);
  //
  // var candlestick = techan.plot.candlestick()
  //         .xScale(x)
  //         .yScale(y);
  //
  // // var xAxis = d3.axisBottom()
  // //         .scale();
  //
  // var xAxis = d3.axisBottom(x);
  //
  // var yAxis = d3.axisLeft()
  //         .scale(y);
  //
  // var svg = d3.select("body").append("svg")
  //         .attr("width", width + margin.left + margin.right)
  //         .attr("height", height + margin.top + margin.bottom)
  //         .append("g")
  //         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  //
  // d3.json("https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=AAPL&apikey=Y0W8FJVMBZ4PGPYU", function(error, data) {
  //
  //     console.log(data['Time Series (Daily)']);
  //
  //     svg.append("g")
  //             .attr("class", "candlestick");
  //
  //     svg.append("g")
  //             .attr("class", "x axis techan daily clamped")
  //             .attr("transform", "translate(0," + height + ")");
  //
  //     svg.append("g")
  //             .attr("class", "y axis")
  //             .append("text")
  //             .attr("transform", "rotate(-90)")
  //             .attr("y", 6)
  //             .attr("dy", ".71em")
  //             .style("text-anchor", "end")
  //             .text("Price ($)");
  //
  //     // Data to display initially
  //     // draw(data.slice(0, data.length-20));
  //     var obj = data['Time Series (Daily)'];
  //
  //     var result = getDailyData(obj);
  //     result = result.slice(50,result.length);
  //
  //     console.log(result);
  //
  //     draw(result);
  //     // Only want this button to be active if the data has loaded
  //     // d3.select("button").on("click", function() { draw(data); }).style("display", "inline");
  // });
  //
  // function draw(data) {
  //     x.domain(data.map(candlestick.accessor().d));
  //     y.domain(techan.scale.plot.ohlc(data, candlestick.accessor()).domain());
  //
  //     svg.selectAll("g.candlestick").datum(data).call(candlestick);
  //     svg.selectAll("g.x.axis").call(xAxis);
  //     svg.selectAll("g.y.axis").call(yAxis);
  //
  //     $.ajax({
  //       type: 'GET',
  //       url: 'https://www.alphavantage.co/query',
  //       data: {
  //         function: 'TIME_SERIES_DAILY',
  //         symbol: 'AMZN',
  //         apikey: 'Y0W8FJVMBZ4PGPYU'
  //       },
  //       success: function(response) {
  //         var obj = response['Time Series (Daily)'];
  //         var result = getDailyData(obj);
  //         result = result.slice(50,result.length);
  //
  //         svg.append("g")
  //                 .attr("class", "candlestickS");
  //
  //         svg.selectAll("g.candlestickS").datum(result).call(candlestick);
  //       },
  //     });
  //
  //
  // }
  //
  // function getDailyData(obj){
  //   var accessor = candlestick.accessor();
  //   var result = Object.keys(obj).map(function(e) {
  //   obj[e].date = e;
  //   return {
  //     date: parseDate(e),
  //     open: +obj[e]['1. open'],
  //     high: +obj[e]['2. high'],
  //     low: +obj[e]['3. low'],
  //     close: +obj[e]['4. close'],
  //     volume: +obj[e]['5. volume']
  //   }
  //
  //   }).sort(function(a, b) { return d3.ascending(accessor.d(a), accessor.d(b)); });
  //
  //   return result;
  // }

})();
