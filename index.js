var width = 800;
var height = 500;

// ! Bar Chart
const barChart = d3
  .select("#barChart")
  .attr("width", width)
  .attr("height", height);

const renderBarChart = (data) => {
  const xValue = (d) => d.Year;
  const yValue = (d) => d.Country;

  const marginLeftBarChart = 120;
  const marginTopBarChart = 40;
  const marginBottomBarChart = 50;
  const marginRightBarChart = 20;
  const innerWidth = width - marginLeftBarChart - marginRightBarChart;
  const innerHeight = height - marginTopBarChart - marginBottomBarChart;

  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, xValue)])
    .range([0, innerWidth])
    .nice();
  const yScale = d3
    .scaleBand()
    .domain(data.map(yValue))
    .range([0, innerHeight])
    .padding(0.1);

  const gBarChart = barChart
    .append("g")
    .attr(
      "transform",
      `translate(${marginLeftBarChart}, ${marginTopBarChart})`
    );

  const xAxisTickFormat = (number) =>
    d3.format(".2s")(number).replace("G", "B");

  gBarChart
    .append("g")
    .call(d3.axisLeft(yScale))
    .selectAll(".domain, .tick line")
    .remove();

  const xAxisG = gBarChart
    .append("g")
    .call(
      d3.axisBottom(xScale).tickFormat(xAxisTickFormat).tickSize(-innerHeight)
    )
    .attr("transform", `translate(0, ${innerHeight})`);

  xAxisG.select(".domain").remove();
  xAxisG
    .append("text")
    .attr("class", "xAxisLabel")
    .text("Population")
    .attr("x", innerWidth / 2)
    .attr("y", 40);

  gBarChart
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("y", (d) => yScale(yValue(d)))
    .attr("width", (d) => xScale(xValue(d)))
    .attr("height", yScale.bandwidth())
    .attr("fill", "steelblue")
    .attr("stroke", "black");

  gBarChart
    .append("text")
    .text("Most populous countries in 2016")
    .attr("class", "chartTitle")
    .attr("x", innerWidth / 2)
    .attr("y", -10);
};

d3.csv("PopulationByCountry.csv").then((data) => {
  data.forEach((d) => {
    d.Year = +d.Year;
  });
  renderBarChart(data);
});

// ! Scatter Plot
const scatterPlot = d3
  .select("#scatterPlot")
  .attr("width", width)
  .attr("height", height);

const renderScatterPlot = (data) => {
  const xValue = (d) => d.GrLivArea;
  const yValue = (d) => d.SalePrice;

  const marginLeftScatterPlot = 120;
  const marginTopScatterPlot = 40;
  const marginBottomScatterPlot = 50;
  const marginRightScatterPlot = 20;
  const innerWidth = width - marginLeftScatterPlot - marginRightScatterPlot;
  const innerHeight = height - marginTopScatterPlot - marginBottomScatterPlot;

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(data, yValue))
    .range([innerHeight, 0])
    .nice();

  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(data, xValue))
    .range([0, innerWidth])
    .nice();

  const gScatterPlot = scatterPlot
    .append("g")
    .attr(
      "transform",
      `translate(${marginLeftScatterPlot}, ${marginTopScatterPlot})`
    );

  const yAxisGScatterPlot = gScatterPlot.append("g").call(d3.axisLeft(yScale));

  const xAxisGScatterPlot = gScatterPlot
    .append("g")
    .call(d3.axisBottom(xScale))
    .attr("transform", `translate(0, ${innerHeight})`);
  xAxisGScatterPlot
    .append("text")
    .attr("class", "xAxisLabel")
    .text(`Gross Living Area [m²]`)
    .attr("x", innerWidth / 2)
    .attr("y", 40);

  yAxisGScatterPlot
    .append("text")
    .attr("class", "yAxisLabelScatterPlot")
    .text("House Prices [$]")
    .attr("x", -innerHeight / 2)
    .attr("y", -60)
    .style("transform", "rotate(-90deg)");

  scatterPlot
    .select("#scatterPlot > g > g:nth-child(2) > g:last-of-type > line")
    .attr("y2", -innerHeight);
  scatterPlot
    .select("#scatterPlot > g > g:nth-child(1) > g:last-of-type > line")
    .attr("x2", innerWidth);
  scatterPlot
    .select("#scatterPlot .tick line")
    .attr("class", "tickLineScatterPlot");

  gScatterPlot
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function (d) {
      return xScale(d.GrLivArea);
    })
    .attr("cy", function (d) {
      return yScale(d.SalePrice);
    })
    .attr("r", 3)
    .style("fill", "red")
    .style("opacity", 0.3);

  gScatterPlot
    .append("text")
    .text("House Prices vs Gross Living Area")
    .attr("class", "chartTitle")
    .attr("x", innerWidth / 2)
    .attr("y", -10);
};

d3.csv("LivingArea.csv").then((data) => {
  data.forEach((d) => {
    d.SalePrice = +d.SalePrice;
    d.GrLivArea = +d.GrLivArea;
  });
  renderScatterPlot(data);
});

// ! Line Chart
const LineChart = d3
  .select("#lineChart")
  .attr("width", width)
  .attr("height", height);

const renderLineChart = (data) => {
  const marginLeftLineChart = 80;
  const marginTopLineChart = 40;
  const marginBottomLineChart = 65;
  const marginRightLineChart = 20;
  const innerWidth = width - marginLeftLineChart - marginRightLineChart;
  const innerHeight = height - marginTopLineChart - marginBottomLineChart;

  const gLineChart = LineChart.append("g").attr(
    "transform",
    `translate(${marginLeftLineChart}, ${marginTopLineChart})`
  );
  // ! Defining ranges and domains of x and y axes

  // Calculating the min and max values for extend from "Kragujevac" and "Tallinn" columns

  // For every dimension individually
  var extents = ["Kragujevac", "Tallinn"].map(function (dimensionName) {
    return d3.extent(data, function (d) {
      return d[dimensionName];
    });
  });
  // Global min and max
  var extent = [
    d3.min(extents, function (d) {
      return d[0];
    }),
    d3.max(extents, function (d) {
      return d[1];
    }),
  ];
  var yScaleLineChart = d3
    .scaleLinear()
    .range([innerHeight, 0])
    .domain(extent)
    .nice();

  var xScaleLineChart = d3
    .scaleTime()
    .range([0, innerWidth])
    .domain(
      d3.extent(data, function (d) {
        return d.date;
      })
    );
  // ! Defining the first line
  var populationLine = d3
    .line()
    .x(function (d) {
      return xScaleLineChart(d.date);
    })
    .y(function (d) {
      return yScaleLineChart(d.Kragujevac);
    })
    .curve(d3.curveBasis);
  // ! Defining the second line
  var lineTallinn = d3
    .line()
    .x(function (d) {
      return xScaleLineChart(d.date);
    })
    .y(function (d) {
      return yScaleLineChart(d.Tallinn);
    })
    .curve(d3.curveBasis);
  // ! Creating the chart
  gLineChart
    .append("path")
    .data(data)
    .attr("class", "line")
    .attr("d", populationLine(data))
    .attr("stroke", "#1F77B4");

  gLineChart
    .append("path")
    .data(data)
    .attr("d", lineTallinn(data))
    .attr("class", "line")
    .attr("stroke", "#FF7F0E");

  // ! Introducing axes for the chart
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  const yAxisGLineChart = gLineChart
    .append("g")
    .attr("class", "yAxisLineChart")
    .call(d3.axisLeft(yScaleLineChart).tickPadding(10));
  const xAxisGLineChart = gLineChart
    .append("g")
    .attr("class", "xAxisLineChart")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(
      d3
        .axisBottom(xScaleLineChart)
        .tickFormat(function (d) {
          return months[d.getMonth()];
        })
        .tickPadding(10)
        .tickSizeOuter(0)
    );
  // ! Positioning of axes and creation of title of chart
  xAxisGLineChart
    .append("text")
    .attr("class", "xAxisLabel")
    .text(`Time`)
    .attr("x", innerWidth / 2)
    .attr("y", 50);

  yAxisGLineChart
    .append("text")
    .attr("class", "yAxisLabelLineChart")
    .text("Temperature [°C]")
    .attr("x", -innerHeight / 2)
    .attr("y", -40)
    .style("transform", "rotate(-90deg)");
  gLineChart
    .append("text")
    .text("Outdoor Temperatures")
    .attr("class", "chartTitle")
    .attr("x", innerWidth / 2)
    .attr("y", -10);
  d3.select("#lineChart > g > g:nth-child(3) > path").attr("stroke", "white");
  var borderPath = gLineChart
    .append("rect")
    .attr("x", 0)
    .attr("y", 0.5)
    .attr("height", innerHeight)
    .attr("width", innerWidth)
    .attr("id", "borderLineChart")
    .style("fill", "none")
    .style("stroke-width", "1px");
  var SVG = d3.select("#lineChart");
  var keys = ["Kragujevac", "Tallinn"];
  var color = ["#1F77B4", "#FF7F0E"];

  var positionXLegend = 100;
  var positionYLegend = 80;
  var size = 15;
  SVG.selectAll("dots")
    .data(color)
    .enter()
    .append("rect")
    .attr("x", positionXLegend)
    .attr("y", function (d, i) {
      return positionYLegend + i * (size + 5);
    })
    .attr("width", size)
    .attr("height", size)
    .style("fill", function (d) {
      return d;
    });
  SVG.selectAll("#mylabels")
    .data(keys)
    .enter()
    .append("text")
    .attr("class", "myLab")
    .attr("x", positionXLegend + size * 1.2)
    .attr("y", function (d, i) {
      return positionYLegend + i * (size + 5) + size / 2;
    })
    .text(function (d) {
      return d;
    })
    .style("fill", "black")
    .style("font-size", "16")
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle");
};

d3.csv("OutdoorTemperatures.csv").then((data) => {
  var parseTime = d3.timeParse("%d-%m-%y");
  data.forEach(function (d) {
    d.date = new Date(parseTime(d.date));
    d.Kragujevac = parseFloat(d.Kragujevac);
    d.Tallinn = parseFloat(d.Tallinn);
  });
  renderLineChart(data);
});

// ! Area Chart
const AreaChart = d3
  .select("#areaChart")
  .attr("width", width)
  .attr("height", height);

const renderAreaChart = (data) => {
  const marginLeftAreaChart = 80;
  const marginTopAreaChart = 50;
  const marginBottomAreaChart = 65;
  const marginRightAreaChart = 20;
  const innerWidth = width - marginLeftAreaChart - marginRightAreaChart;
  const innerHeight = height - marginTopAreaChart - marginBottomAreaChart;

  const gAreaChart = AreaChart.append("g").attr(
    "transform",
    `translate(${marginLeftAreaChart}, ${marginTopAreaChart})`
  );
  // ! Defining ranges and domains of x and y axes
  var yScaleAreaChart = d3
    .scaleLinear()
    .range([innerHeight, 0])
    .domain([0, d3.max(data, (d) => d.Population)])
    .nice();

  var xScaleAreaChart = d3
    .scaleTime()
    .range([0, innerWidth])
    .domain(d3.extent([new Date(1949, 12), new Date(2020, 1)]));
  // ! Defining the line
  var populationArea = d3
    .area()
    .x(function (d) {
      return xScaleAreaChart(d.Year);
    })
    .y0(innerHeight)
    .y1(function (d) {
      return yScaleAreaChart(d.Population);
    })
    .curve(d3.curveBasis);

  // ! Creating the chart
  gAreaChart
    .append("path")
    .data(data)
    .attr("class", "area")
    .attr("d", populationArea(data))
    .attr("stroke", "black")
    .attr("fill", "maroon");
  // ! Introducing axes for the chart
  const yAxisTickFormat = (number) => d3.format(".1s")(number).replace("G", "");
  const yAxisGAreaChart = gAreaChart
    .append("g")
    .attr("class", "yAxisAreaChart")
    .call(
      d3.axisLeft(yScaleAreaChart).tickFormat(yAxisTickFormat).tickPadding(10)
    );

  const xAxisGAreaChart = gAreaChart
    .append("g")
    .attr("class", "xAxisAreaChart")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(d3.axisBottom(xScaleAreaChart).tickPadding(8));

  // ! Positioning of axes and creation of title of chart
  xAxisGAreaChart
    .append("text")
    .attr("class", "xAxisLabel")
    .text("Year")
    .attr("x", innerWidth / 2)
    .attr("y", 50);

  yAxisGAreaChart
    .append("text")
    .attr("class", "yAxisLabelAreaChart")
    .text("Population (billions)")
    .attr("x", -innerHeight / 2)
    .attr("y", -40)
    .style("transform", "rotate(-90deg)");
  gAreaChart
    .append("text")
    .text("World Population per Year")
    .attr("class", "chartTitle")
    .attr("x", innerWidth / 2)
    .attr("y", -15);
  d3.select("#AreaChart > g > g:nth-child(3) > path").attr("stroke", "white");
  var borderPathArea = gAreaChart
    .append("rect")
    .attr("x", 0)
    .attr("y", 0.5)
    .attr("height", innerHeight)
    .attr("width", innerWidth)
    .attr("id", "borderAreaChart")
    .style("fill", "none")
    .style("stroke-width", "1px");
};

d3.csv("WorldPopulationByYear.csv").then((data) => {
  data.forEach(function (d) {
    d.Year = new Date(d.Year);
    d.Population = +d.Population;
  });
  renderAreaChart(data);
});
