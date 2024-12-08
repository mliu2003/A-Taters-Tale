function drawPotatoValueEfficiency(svg, dimensions) {
  var brush = d3.brush().extent([
    [0, 0],
    [width, height],
  ]);

  /**
   * Preprocesses raw potato data on yield, price, area, and seeding
   *
   * {
   *   state: string,        // State data is from
   *   yield: number,        // Potato yield in cwt per acre
   *   price: number,        // Price of potatoes in dollars per cwt
   *   area: number,         // Total area of potato cultivation in acres
   *   seeding: number,      // Total used for seeding in cwt
   *   yieldValue: number,   // Monetary value of the yield in dollars per acre
   *   plantingCost: number  // Cost of planting potatoes in dollars per acre
   * }
   *
   * @param {object} row - A single row of data from the CSV file.
   * @returns {object} - A processed data object with the structure described above.
   */
  function potatoValueDataPreprocessor(row) {
    return {
      state: row["State"],
      yield: +row["Yield(cwt/acre)"],
      price: +row["Price(dollar/cwt)"],
      area: +row["Area(acre)"],
      seeding: +row["Seeding(cwt)"],
      yieldValue: +row["YieldValue(dollar/acre)"],
      plantingCost: +row["PlantingCost(dollar/acre)"],
    };
  }

  const attributes = [
    "yield",
    "price",
    "area",
    "seeding",
    "yieldValue",
    "plantingCost",
  ];

  attributes.forEach(function (attr) {
    d3.select("#xAttribute").append("option").attr("value", attr).text(attr);
    d3.select("#yAttribute").append("option").attr("value", attr).text(attr);
  });

  let currentXAttr = "plantingCost";
  let currentYAttr = "yieldValue";

  d3.select("#xAttribute").property("value", currentXAttr);
  d3.select("#yAttribute").property("value", currentYAttr);

  Promise.all([
    d3.json("data/us-states.json"),
    d3.csv("data/potatovalueefficiency.csv", potatoValueDataPreprocessor),
  ]).then(function ([geoData, dataset]) {
    var toolTip = d3
      .tip()
      .attr("class", "d3-tip")
      .offset([-12, 0])
      .html(function (event, d) {
        return `<div>
        <h5>${d.state}</h5>
        <p>Planting Cost: $${d.plantingCost.toFixed(2)}</p>
        <p>Yield Value: $${d.yieldValue.toFixed(2)}</p>
      </div>`;
      });

    var margin = { top: 40, right: 40, bottom: 60, left: 70 },
      width = dimensions.width - margin.left - margin.right,
      height = dimensions.height - margin.top - margin.bottom;
    var xScale = d3.scaleLinear().range([0, width]);
    var yScale = d3.scaleLinear().range([height, 0]);
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);

    const containerHeight = dimensions.height;
    const viewBoxHeight = containerHeight * 2;
    const viewBoxWidth = containerHeight * 2;
    const svgMap = d3
      .select("#map-container")
      .append("svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", `0 0 ${viewBoxWidth} ${viewBoxHeight}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .attr("id", "potato-value-map");
    const mapBounds = svgMap.node().getBoundingClientRect();
    console.log("Map bounds:", mapBounds);
    console.log("Map width:", mapBounds.width);
    console.log("Map height:", mapBounds.height);
    const mapwidth = mapBounds.width;
    const mapheight = mapBounds.height;
    const projection = d3
      .geoNaturalEarth1()
      .fitSize([mapwidth * 3.2, mapheight * 3.2], geoData);

    const pathGenerator = d3.geoPath().projection(projection);
    var states = [...new Set(dataset.map((d) => d.state))];
    var colorScale = d3
      .scaleSequential()
      .domain(d3.extent(dataset, (d) => d.yieldValue))
      .interpolator((d) => {
        if (d === 1) return "#A9A9A9";
        return d3.interpolateRgb("#08306b", "#ffffff")(d);
      });
    const mapGroup = svgMap
      .append("g")
      .attr("transform", `translate(${mapwidth * 0.05}, ${mapheight * 0.1})`);
    const mapPaths = mapGroup
      .append("g")
      .selectAll("path")
      .data(geoData.features)
      .join("path")
      .attr("d", pathGenerator)
      .attr("fill", function (d) {
        var stateName = d.properties.NAME.trim().toLowerCase();
        var stateData = dataset.find(
          (item) => item.state.trim().toLowerCase() === stateName
        );
        if (stateData && stateData.yieldValue !== null) {
          return colorScale(stateData.yieldValue);
        } else {
          return "lightgray";
        }
      })
      .attr("stroke", "#fff");

    var selectedStates = new Set();
    function updateHighlighting() {
      svgMap
        .selectAll("path")
        .classed("selected", function (d) {
          return selectedStates.has(d.properties.NAME.trim().toLowerCase());
        })
        .classed("non-selected", function (d) {
          return (
            !selectedStates.has(d.properties.NAME.trim().toLowerCase()) &&
            selectedStates.size > 0
          );
        });

      svg
        .selectAll(".dot")
        .classed("selected", function (d) {
          return selectedStates.has(d.state.trim().toLowerCase());
        })
        .classed("non-selected", function (d) {
          return (
            !selectedStates.has(d.state.trim().toLowerCase()) &&
            selectedStates.size > 0
          );
        });
    }

    const mapBrush = d3
      .brush()
      .extent([
        [0, 0],
        [mapwidth * 3.2, mapheight * 3.2],
      ])
      .on("brush", mapBrushmove)
      .on("end", mapBrushend);

    const mapBrushGroup = svgMap.append("g").attr("class", "map-brush");
    mapBrushGroup.call(mapBrush);

    xScale
      .domain([
        d3.min(dataset, (d) => d[currentXAttr]),
        d3.max(dataset, (d) => d[currentXAttr]),
      ])
      .nice();
    yScale.domain(d3.extent(dataset, (d) => d[currentYAttr])).nice();

    const svgScatterplot = svg
      .append("svg")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)
      .attr("id", "potato-value-scatterplot")
      .style("transform", "scale(0.5)")
      .style("opacity", 0)
      .call(toolTip);
    svgScatterplot
      .transition()
      .duration(1000)
      .style("transform", "scale(1)")
      .style("opacity", 1);

    const scatterplotG = svgScatterplot
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    scatterplotG
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .append("text")
      .attr("class", "axis-label")
      .attr("x", width / 2)
      .attr("y", 40)
      .style("text-anchor", "middle")
      .text("Cost to Plant");

    scatterplotG
      .append("g")
      .attr("class", "y-axis")
      .call(yAxis)
      .append("text")
      .attr("class", "axis-label")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -50)
      .style("text-anchor", "middle")
      .text("Value per Acre");

    scatterplotG.append("g").attr("class", "brush").call(brush);

    const dots = scatterplotG
      .append("g")
      .attr("class", "dots")
      .selectAll(".dot")
      .data(
        dataset.filter((d) => d.plantingCost !== null && d.yieldValue !== null)
      )
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => xScale(d[currentXAttr]))
      .attr("cy", (d) => yScale(d[currentYAttr]))
      .attr("r", 8)
      .style("fill", (d) => colorScale(d.yieldValue))
      .on("mouseover", toolTip.show)
      .on("mouseout", toolTip.hide);

    brush.on("brush", brushmove).on("end", brushend);

    function brushmove(event) {
      var selection = event.selection;
      if (selection) {
        var [[x0, y0], [x1, y1]] = selection;
        var brushedData = [];
        scatterplotG.selectAll(".dot").classed("hidden", function (d) {
          var x = xScale(d[currentXAttr]);
          var y = yScale(d[currentYAttr]);
          var isBrushed = x0 <= x && x <= x1 && y0 <= y && y <= y1;
          if (isBrushed) brushedData.push(d);
          return !isBrushed;
        });

        selectedStates = new Set(
          brushedData.map((d) => d.state.trim().toLowerCase())
        );

        svgMap
          .selectAll("path")
          .classed("selected", (d) => {
            var stateName = d.properties.NAME.trim().toLowerCase();
            return selectedStates.has(stateName);
          })
          .classed("non-selected", (d) => {
            var stateName = d.properties.NAME.trim().toLowerCase();
            return !selectedStates.has(stateName) && selectedStates.size > 0;
          });
      }
    }

    function brushend(event) {
      if (!event.selection) {
        scatterplotG.selectAll(".hidden").classed("hidden", false);
        selectedStates.clear();
        updateHighlighting();
      }
    }

    function mapBrushmove(event) {
      var selection = event.selection;
      if (selection) {
        var [[x0, y0], [x1, y1]] = selection;
        selectedStates.clear();

        svgMap.selectAll("path").each(function (d) {
          var bbox = this.getBBox();
          var x = bbox.x + bbox.width / 2;
          var y = bbox.y + bbox.height / 2;
          var isBrushed = x0 <= x && x <= x1 && y0 <= y && y <= y1;

          if (isBrushed) {
            var stateName = d.properties.NAME.trim().toLowerCase();
            selectedStates.add(stateName);
          }
        });

        updateHighlighting();

        scatterplotG.selectAll(".dot").classed("hidden", function (d) {
          return !selectedStates.has(d.state.trim().toLowerCase());
        });
      }
    }

    function mapBrushend(event) {
      if (!event.selection) {
        selectedStates.clear();
        updateHighlighting();
        scatterplotG.selectAll(".hidden").classed("hidden", false);
      }
    }

    function updateScatterplot() {
      currentXAttr = d3.select("#xAttribute").property("value");
      currentYAttr = d3.select("#yAttribute").property("value");

      xScale.domain(d3.extent(dataset, (d) => d[currentXAttr])).nice();
      yScale.domain(d3.extent(dataset, (d) => d[currentYAttr])).nice();

      scatterplotG
        .select(".x-axis")
        .transition()
        .duration(1000)
        .call(xAxis)
        .select(".axis-label")
        .text(currentXAttr);

      scatterplotG
        .select(".y-axis")
        .transition()
        .duration(1000)
        .call(yAxis)
        .select(".axis-label")
        .text(currentYAttr);

      scatterplotG
        .selectAll(".dot")
        .transition()
        .duration(1000)
        .attr("cx", (d) => xScale(d[currentXAttr]))
        .attr("cy", (d) => yScale(d[currentYAttr]));

      scatterplotG.select(".brush").call(brush.move, null);
      scatterplotG.selectAll(".hidden").classed("hidden", false);
      selectedStates.clear();
      updateHighlighting();
    }
  });
}
