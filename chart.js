

let drawBarChart = function(data){
  //creates a map of terminal
  let terminal = data.map(row => row['Terminal']);
  terminal.sort();
  //creates a map of passengerCount
  let passengerCount = data.map(row => row.num);
  //console.log(passengerCount);
  //gives max passenger count from these
  let countMax = d3.max(passengerCount.values());
  //console.log(passengerCount);

  // //creates map of dates - doesn't work
  // let dates = data.map(d => d.values);
  // console.log(dates);
  // let merged = d3.merge(dates);
  // console.log(merged);
/*  let dates = data[0].values.map(value => value.value);
  console.log(dates)*/

  let svg = d3.select("body").select(".barchart");
  console.assert(svg.size() == 1);
  let countMin = 0;
  //let countMax = d3.max(count);
  console.log([countMin, countMax]);
  //margin for axis, titles, ticks and so on
  let margin ={
    top:50,
    right: 20,
    bottom: 30,
    left: 90
  };
  //plots for svg
  let bounds = svg.node().getBoundingClientRect();
//  console.log(bounds.width + " , " + bounds.height);
  let plotWidth = bounds.width - margin.right - margin.left;
  let plotHeight = bounds.height - margin.top - margin.bottom;
//scales
  let passengerYScale = d3.scaleLinear()
          .domain([0, d3.max(passengerCount.values())])
          .range([plotHeight,0])
          .nice();
  let terminalXScale = d3.scaleBand()
          .domain(terminal)
          .rangeRound([0, plotWidth])
          .paddingInner(0.1);

  //plot it on svg
  let plot = svg.append("g").attr("id", "plot");
  //plot..attr("width", plotWidth + margin.left + margin.right)
  //  .attr("height", plotHeight + margin.top + margin.bottom);
  plot.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  //draw axis
  let xAxis = d3.axisBottom(terminalXScale);
  let yAxis = d3.axisLeft(passengerYScale);

  yAxis.ticks(5, "f").tickFormat(d3.formatPrefix(".0", 1e6));

  let xGroup = plot.append("g").attr("id", "x-axis");
    xGroup.call(xAxis);

    // notice it is at the top of our svg
    // we need to translate/shift it down to the bottom
    xGroup.attr("transform", "translate(0," + plotHeight + ")");

    // do the same for our y axix
    let yGroup = plot.append("g").attr("id", "y-axis");
    yGroup.call(yAxis);

    //label for x-axis
    svg.append("text")
        .attr("class", "text")
        .attr("dx","1em")
        .attr("transform",
        "translate(" + (plotWidth/2) + " ," +
                                 (margin.top) + ")")
      .style("text-anchor", "middle")
      .text("Terminal");

      //label for y-axis
    svg.append("text")
        .attr("class", "text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.right + 20)
        .attr("x",0 - (plotHeight / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Max Number of Passenger Count");
    // for graph title
    svg.append("text")
    .attr("class", "title")
    .attr("x", (plotWidth / 2))
    .attr("y", 0 + (margin.top / 2))
    .attr("text-anchor", "middle")
    .text("Max Passenger Count over each Terminal");

    //grid lines
    // Gridline
   var gridlines = d3.axisLeft()
                     .tickFormat("")
                     .tickSize(-plotWidth)
                     .scale(passengerYScale);

   svg.append("g")
      .attr("class", "grid")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(gridlines);

    //draw bars in graph
    // append the rectangles for the bar chart
  svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return terminalXScale(d.Terminal); })
      .attr("width", terminalXScale.bandwidth())
      .attr("y", function(d) { return passengerYScale(d.num); })
      .attr("height", function(d) { return plotHeight - passengerYScale(d.num); })
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // so we can access some of these elements later...
    // add them to our chart global
  chart.plotWidth = plotWidth;
  chart.plotHeight = plotHeight;

  chart.xAxis = xAxis;
  chart.yAxis = yAxis;

  chart.passengerYScale = passengerYScale;
  chart.terminalXScale = terminalXScale;
  chart.gridlines = gridlines;
};

// ??DRAW LINE Chart

 let drawLineChart = function (data) {
   var monthsNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

   //count num of pas for each month (combine months)
   let monthly = Object.values(data.reduce((r, o) => {
     r[o.date.getMonth()] = r[o.date.getMonth()] || {month: monthsNames[o.date.getMonth()], num : 0};
     r[o.date.getMonth()].num += +o.num;
     return r;
   },{}))

      //gives passenger counts
      let passengerCount = monthly.map(d => d.num);
      //GEO_Summary
      let geoSummary = data.map(row => row['GEO_Summary']);
      geoSummary.sort();
      console.log(geoSummary);
      // Nest the entries by symbol
    var dataNest = d3.nest()
        .key(function(d) {return d.GEO_Summary;})
        .entries(data);

      let min = 0;
      let max = Math.max(...passengerCount);
      if (isNaN(max)) {
        max = 0;
      }
    //  console.log("count bounds:", [min, max]);

      let svg = d3.select("body").select(".linechart");
      console.assert(svg.size() == 1);

      let margin = {
      top:    50,
      right:  20,
      bottom: 30,
      left:  50
      };

      // now we can calculate how much space we have to plot
      let bounds = svg.node().getBoundingClientRect();
      let plotWidth = bounds.width - margin.right - margin.left;
      let plotHeight = bounds.height - margin.top - margin.bottom;

      let passengerYScale = d3.scaleLinear()
        .domain([min, max])
        .range([plotHeight, 0])
      //	.nice(); // rounds the domain a bit for nicer output

      let months = monthly.map(d => d.month);
    //  months.sort();
      let monthXScale = d3.scaleBand()
        .domain(months) // all region (not using the count here)
        .rangeRound([0, plotWidth])
        //.paddingInner(0.23); // space between bars

      let plot = svg.append("g").attr("id", "plot");
      plot.attr("transform", translate(margin.left,margin.top));

      console.assert(plot.size() == 1);

      let xAxis = d3.axisBottom(monthXScale);
      let yAxis = d3.axisLeft(passengerYScale);
      yAxis.ticks(5, "f").tickFormat(d3.formatPrefix(".0", 1e6));
      let xGroup = plot.append("g").attr("id", "x-axis");
      xGroup.call(xAxis);
      xGroup.attr("transform", translate(0, plotHeight));

      let yGroup = plot.append("g").attr("id", "y-axis");
      yGroup.call(yAxis);


      let pairs = Array.from(monthly);

      let line1 = d3.line()
            .x(function(d) {return monthXScale(d.month)+40})
            .y(function(d) {return passengerYScale(d.num)+5});

      plot.append("path")
      .datum(pairs)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("width", monthXScale.bandwidth())
      .attr("height", function(d) { return plotHeight - passengerYScale(d.num)})
      .attr("d", line1
      // d3.line()
      //   .x(function(d) { return monthXScale(d.month) + 40})
      //   .y(function(d) { return passengerYScale(d.num)+5})
      //   //.curve(d3.curveMonotoneX)
      );

      //label for x-axis
      svg.append("text")
          .attr("class", "text")
          .attr("dx","1em")
          .attr("transform",
          "translate(" + (plotWidth/2) + " ," +
                                   (margin.top) + ")")
        .style("text-anchor", "middle")
        .text("Months of Activity Period");

        //label for y-axis
      svg.append("text")
          .attr("class", "text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin.right + 20)
          .attr("x",0 - (plotHeight / 2))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text("Passenger Count");
      // for graph title
      svg.append("text")
      .attr("class", "title")
      .attr("x", (plotWidth / 2))
      .attr("y", 0 + (margin.top / 2))
      .attr("text-anchor", "middle")
      .text("Maximum number of passengers travelled over time ");

      //grid lines
      // Gridline
    var gridlines = d3.axisLeft()
                       .tickFormat("")
                       .tickSize(-plotWidth)
                       .scale(passengerYScale);

     svg.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(gridlines);
};

function translate(x, y) {
  return 'translate(' + x + ',' + y + ')';
}

//DRAW LINE Chart
/*let drawLineChart = function(data){
//get data from csv
  let monthly = Object.values(data.reduce((r, o) => {
    			r[o.date.getMonth()] = r[o.date.getMonth()] || {month: o.date.getMonth()+1, num : 0};
    			r[o.date.getMonth()].num += +o.num;
    			return r;
  			},{}));
//  console.log(monthly);
  let months = monthly.map(row => row.month);

  let svg = d3.select("body").select(".linechart");
  console.log(svg.size());
  console.assert(svg.size() == 1);
//  let countMin = 0;
  //let countMax = d3.max(count);
  //console.log([countMin, countMax]);
  //margin for axis, titles, ticks and so on
  let margin ={
    top:50,
    right: 20,
    bottom: 30,
    left: 90
  };
  //plots for svg
  let bounds = svg.node().getBoundingClientRect();
  console.log(bounds.width + " , " + bounds.height);
  let plotWidth = bounds.width - margin.right - margin.left;
  let plotHeight = bounds.height - margin.top - margin.bottom;
  //console.log(plotHeight);
//scales
  let passengerYScale = d3.scaleLinear()
          .domain([0, d3.max(data, function(d) { return d.num; })])
          .range([plotHeight,0])
          .nice();

//  console.log(d3.max(dates.values()));
  let datesXScale = d3.scaleBand()
          .domain(months)
          .rangeRound([0, plotWidth]);
          //.padding(0.1);

  //plot it on svg
  let plot = svg.append("g").attr("id", "plot");
  //plot..attr("width", plotWidth + margin.left + margin.right)
  //  .attr("height", plotHeight + margin.top + margin.bottom);
  plot.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  let pairs = Array.from(monthly);

  Date.locale = {
      en: {
         month_names_short: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      }
  };
  plot.append("path")
  .datum(pairs)
  .attr("fill", "none")
  .attr("stroke", "steelblue")
  .attr("stroke-width", 1.5)
  .attr("width", datesXScale.bandwidth())
  .attr("height", function(d) { return (plotHeight - passengerYScale(d.num))})
  .attr("d", d3.line()
    .x(function(d) { return datesXScale(d.month) + 40})
    .y(function(d) { console.log(d.num); return passengerYScale(d.num) + 5})
    //.curve(d3.curveMonotoneX)
  )
  //draw axis
  let xAxis = d3.axisBottom(datesXScale);
  let yAxis = d3.axisLeft(passengerYScale);

  let xGroup = plot.append("g").attr("id", "x-axis");
    xGroup.call(xAxis);

    // notice it is at the top of our svg
    // we need to translate/shift it down to the bottom
    xGroup.attr("transform", "translate(0," + plotHeight + ")");

    // do the same for our y axix
    let yGroup = plot.append("g").attr("id", "y-axis");
    yGroup.call(yAxis);





    //label for x-axis
    svg.append("text")
        .attr("class", "text")
        .attr("dx","1em")
        .attr("transform",
        "translate(" + (plotWidth/2) + " ," +
                                 (margin.top) + ")")
      .style("text-anchor", "middle")
      .text("Terminals");

      //label for y-axis
    svg.append("text")
        .attr("class", "text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.right + 20)
        .attr("x",0 - (plotHeight / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Max Number of Passenger Count");
    // for graph title
    svg.append("text")
    .attr("class", "title")
    .attr("x", (plotWidth / 2))
    .attr("y", 0 + (margin.top / 2))
    .attr("text-anchor", "middle")
    .text("Max Passenger Count over each Terminal");

    //grid lines
    // Gridline
  /* var gridlines = d3.axisLeft()
                     .tickFormat("")
                     .tickSize(-plotWidth)
                     .scale(passengerYScale);

   svg.append("g")
      .attr("class", "grid")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(gridlines);*/

  //caption
  // svg.append("text")
  //     .attr("class", "text")
  //     .attr("transform",
  //     "translate(" + 30 + " ," +
  //                              (plotHeight + margin.top + 50) + ")")
  //   .style("text-anchor", "left")
  //   .text("Maximum number of Passenger Count for each Terminal." +
  //     "Data Source := https://data.sfgov.org/Transportation/Air-Traffic-Passenger-Statistics/rkru-6vcg/data");

    // so we can access some of these elements later...
    // add them to our chart global
