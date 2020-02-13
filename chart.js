

let drawBarChart = function(data){
  //creates a map of terminal
  let terminal = data.map(row => row['Terminal']);
  terminal.sort();
  //creates a map of passengerCount
  let passengerCount = data.map(row => row.num);

  //gives max passenger count from these
  let countMax = d3.max(passengerCount.values());
  let svg = d3.select("body").select(".barchart");
//  console.assert(svg.size() == 1);
  let countMin = 0;
  //let countMax = d3.max(count);
  console.log([countMin, countMax]);
  //margin for axis, titles, ticks and so on
  let margin ={
    top:50,
    right: 20,
    bottom: 30,
    left: 60
  };
  //plots for svg
  let bounds = svg.node().getBoundingClientRect();
//  console.log(bounds.width + " , " + bounds.height);
  let plotWidth = bounds.width - margin.right - margin.left;
  let plotHeight = bounds.height - margin.top - margin.bottom;
//scales
  let passengerYScale = d3.scaleLinear()
          .domain([countMin, countMax])
          .range([plotHeight,0])
          .nice();
  let terminalXScale = d3.scaleBand()
          .domain(terminal)
          .rangeRound([0, plotWidth])
          .paddingInner(0.1);

  //plot it on svg
  let plot = svg.append("g").attr("id", "plot");
  plot.attr("transform", translate(margin.left,margin.top));
  //draw axis
  let xAxis = d3.axisBottom(terminalXScale);
  let yAxis = d3.axisLeft(passengerYScale);
  //d3.format("~s")(1500)
  yAxis.ticks(10, "f").tickFormat(d3.formatPrefix(".0", 50000));

  let xGroup = plot.append("g").attr("id", "x-axis");
  xGroup.call(xAxis);

    // notice it is at the top of our svg
    // we need to translate/shift it down to the bottom
  xGroup.attr("transform", translate(0,plotHeight));

    // do the same for our y axix
    let yGroup = plot.append("g").attr("id", "y-axis");
    yGroup.call(yAxis);

    //label for x-axis
    svg.append("text")
        .attr("class", "x-axis-label")
        .attr("dx","1em")
        .attr("transform",
        "translate(" + (plotWidth/2 + margin.right)  + " ," +
                                 (margin.top) + ")")
      .style("text-anchor", "middle")
      .text("Terminal");

      //label for y-axis
    svg.append("text")
        .attr("class", "y-axis-label")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.right + 20)
        .attr("x",0 - (plotHeight / 2 + margin.top))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Max. Passenger Count");
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
      .attr("transform", translate(margin.left, margin.top))
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
      .attr("transform", translate(margin.left, margin.top));

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

// DRAW LINE Chart

 let drawLineChart = function (data) {
   //get data for graph
   var monthsNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
      //separate data from geo summary
      var lineData = {
      International: [],
      Domestic: []
    }

    //DATA from GEO Summary
    data.forEach(function (d) {
      if (d.GEO_Summary === "International") {
            lineData.International.push({
              'num' : d.num,
              'date' : d.date
            })
      }else if(d.GEO_Summary === "Domestic"){
        lineData.Domestic.push({
          'num' : d.num,
          'date' : d.date
        })
      }
    });

    //got separate data for international and domestic
    let International =  Object.values(lineData.International.reduce((r, o) => {
      r[o.date.getMonth()] = r[o.date.getMonth()] || {month: monthsNames[o.date.getMonth()], num : 0};
      r[o.date.getMonth()].num += +o.num;
      return r;
    },{}))

    let Domestic =  Object.values(lineData.Domestic.reduce((r, o) => {
      r[o.date.getMonth()] = r[o.date.getMonth()] || {month: monthsNames[o.date.getMonth()], num : 0};
      r[o.date.getMonth()].num += +o.num;
      return r;
    },{}))


    //gives passenger counts
    let passengerCount = Domestic.map(d => d.num);

      let min = 0;
      let max = d3.max(passengerCount); //use same for bar chart
      if (isNaN(max)) {
        max = 0;
      }

      let svg = d3.select("body").select(".linechart");
      console.assert(svg.size() == 1);

      let margin = {
      top:    60,
      right:  20,
      bottom: 40,
      left:  50
      };

      // now we can calculate how much space we have to plot
      let bounds = svg.node().getBoundingClientRect();
      let plotWidth = bounds.width - margin.right - margin.left;
      let plotHeight = bounds.height - margin.top - margin.bottom;

      let passengerYScale = d3.scaleLinear()
        .domain([min, max])
        .range([plotHeight, 0])

      let months = Domestic.map(d => d.month);
      let monthXScale = d3.scaleBand()
        .domain(months) // all region (not using the count here)
        .rangeRound([0, plotWidth])

      let plot = svg.append("g").attr("id", "plot");
      plot.attr("transform", translate(margin.left,margin.top));

      console.assert(plot.size() == 1);

      let xAxis = d3.axisBottom(monthXScale);
      let yAxis = d3.axisLeft(passengerYScale);
      d3.format(".2s")(42e6)
      yAxis.ticks(5, "f").tickFormat(d3.formatPrefix(".0", 42e6));
      //yAxis.ticks(10, "f").tickFormat(d3.formatPrefix(".0", 50000));
      let xGroup = plot.append("g").attr("id", "x-axis");
      xGroup.call(xAxis);
      xGroup.attr("transform", translate(0, plotHeight));

      let yGroup = plot.append("g").attr("id", "y-axis");
      yGroup.call(yAxis);

      //ADD Line to graph


      let line1 = d3.line()
            //x(function(d){return 5})
            .x(function(d) {return (monthXScale(d.month) + 100)})
            .y(function(d) {return passengerYScale(d.num) + margin.top + 2});

      // CODE FOR MULTI LINE
      svg.append("path")
            .datum(Domestic)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 3)
            .attr("width", monthXScale.bandwidth())
            .attr("height", function(d) { return plotHeight - passengerYScale(d.num)})
            .attr("d", line1);

      svg.append("path")
        .datum(International)
        .attr("fill", "none")
        .attr("stroke", "orange")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 3)
        .attr("width", monthXScale.bandwidth())
        .attr("height", function(d) { return plotHeight - passengerYScale(d.num)})
        .attr("d", line1);
// CODE FOR MULTI-LINE IS OVER
      //albel fro x axis
      svg.append("text")
          .attr("class", "x-axis-label")
          .attr("dx","1em")
          .attr("transform",
          "translate(" + (plotWidth/2 + margin.right + 10) + " ," +
                                   (plotHeight + margin.top + 35) +")")
        .style("text-anchor", "middle")
        .text("Months of Activity Period");

        //label for y-axis
      svg.append("text")
          .attr("class", "y-axis-label")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin.right + 20)
          .attr("x",0 - (plotHeight / 2 + margin.top))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text("Passenger Count");
      // for graph title
      svg.append("text")
      .attr("class", "title")
      .attr("x", (plotWidth / 2 + (2*margin.right)))
      .attr("y", 0 + (margin.top / 2))
      .attr("text-anchor", "middle")
      .text("Maximum number of passengers travelled over time ");

        // Gridline
      var gridlines = d3.axisLeft()
                         .tickFormat("")
                         .tickSize(-plotWidth)
                         .scale(passengerYScale);

      svg.append("g")
          .attr("class", "grid")
          .attr("transform", translate(margin.left, margin.top))
          .call(gridlines);
      //legends
      svg.append("rect")
        .attr("x", plotWidth - margin.right - margin.left - margin.top - margin.bottom)
        .attr("y", margin.top /2)
        .attr("width", 15)
        .attr("height", 15)
        .style("fill", "steelblue")
      svg.append("rect")
          .attr("x", plotWidth - margin.right - margin.left + 10)
          .attr("y", margin.top /2)
          .attr("width", 15)
          .attr("height", 15)
          .style("fill", "orange")
          //text for legend 
      svg.append("text")
      .attr("x", plotWidth - margin.right - margin.left - margin.top - margin.bottom + 19)
      .attr("y", margin.top/2 + 10)
      .text("Domestic")
      .style("font-size", "12px")
      .attr("alignment-baseline","middle")
      svg
      .append("text")
      .attr("x", plotWidth + margin.right - margin.left - 10)
      .attr("y", margin.top/2 + 10)
      .text("International")
      .style("font-size", "12px")
      .attr("alignment-baseline","middle")

};

function translate(x, y) {
  return 'translate(' + x + ',' + y + ')';
}
