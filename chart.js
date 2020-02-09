

let drawBarChart = function(data){
//  console.log(data);
  //console.log(data[0].Passenger_Count);

  //creates a map of terminal
  let terminal = data.map(row => row['Terminal']);
  terminal.sort();
  //creates a map of passengerCount
  let passengerCount = data.map(row => row['Passenger_Count']);
  console.log(passengerCount);
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
    top:30,
    right: 20,
    bottom: 50,
    left: 90
  };
  //plots for svg
  let bounds = svg.node().getBoundingClientRect();
  console.log(bounds.width + " , " + bounds.height);
  let plotWidth = bounds.width - margin.right - margin.left;
  let plotHeight = bounds.height - margin.top - margin.bottom;
//scales
  let passengerYScale = d3.scaleLinear()
          .domain([0, d3.max(data, function(d) { return d.Passenger_Count; })])
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

  let xGroup = plot.append("g").attr("id", "x-axis");
    xGroup.call(xAxis);

    // notice it is at the top of our svg
    // we need to translate/shift it down to the bottom
    xGroup.attr("transform", "translate(0," + plotHeight + ")");

    // do the same for our y axix
    let yGroup = plot.append("g").attr("id", "y-axis");
    yGroup.call(yAxis);

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
      .attr("y", function(d) { return passengerYScale(d.Passenger_Count); })
      .attr("height", function(d) { return plotHeight - passengerYScale(d.Passenger_Count); })
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      //label for x-axis
  svg.append("text")
      .attr("class", "text")
      .attr("transform",
      "translate(" + (plotWidth/2) + " ," +
                               (plotHeight + margin.top + 40) + ")")
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


    // so we can access some of these elements later...
    // add them to our chart global
  chart.plotWidth = plotWidth;
  chart.plotHeight = plotHeight;

  chart.xAxis = xAxis;
  chart.yAxis = yAxis;

  chart.passengerYScale = passengerYScale;
  chart.terminalXScale = terminalXScale;
};
