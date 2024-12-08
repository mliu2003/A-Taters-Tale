function drawPotatoProduction(svg, dimensions) {
  svg.style("opacity", 0).transition().duration(800).style("opacity", 1);

  const statesGroup = svg
    .append("g")
    .attr("class", "states")
    .style("opacity", 0);

  const legendGroup = svg
    .append("g")
    .attr("class", "legend")
    .attr(
      "transform",
      `translate(${dimensions.width - 330}, ${dimensions.height - 50})`
    )
    .style("opacity", 0);

  Promise.all([
    d3.csv("data/potatoproduction.csv"),
    d3.json("data/us-states-full.json"),
  ]).then(([rawData, geoJson]) => {
    const productionData = new Map(
      rawData.map((row) => {
        const stateName = row.State.trim().toUpperCase();
        const production = parseFloat(row.Production.replace(/,/g, ""));
        return [stateName, production];
      })
    );

    const colorScale = d3
      .scaleSequential()
      .domain([0, d3.max(Array.from(productionData.values()))])
      .interpolator(d3.interpolateRgb("#4a90e2", "#08306b"));

    const projection = d3
      .geoAlbersUsa()
      .fitSize([dimensions.width, dimensions.height], geoJson);

    const pathGenerator = d3.geoPath().projection(projection);

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "white")
      .style("border", "1px solid #ddd")
      .style("padding", "10px")
      .style("border-radius", "3px")
      .style("pointer-events", "none");

    const positionTooltip = (event) => {
      const tooltipNode = tooltip.node();
      const tooltipRect = tooltipNode.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let left = event.pageX + 10;
      let top = event.pageY - 10;

      if (left + tooltipRect.width > viewportWidth) {
        left = event.pageX - tooltipRect.width - 10;
      }

      if (top + tooltipRect.height > viewportHeight) {
        top = event.pageY - tooltipRect.height - 10;
      }

      if (left < 0) left = 10;
      if (top < 0) top = 10;

      return { left, top };
    };

    statesGroup
      .selectAll("path")
      .data(geoJson.features)
      .join("path")
      .attr("d", pathGenerator)
      .attr("fill", "#f0f0f0")
      .attr("stroke", "#fff")
      .attr("stroke-width", 0.5)
      .on("mouseover", (event, d) => {
        const stateName = d.properties.NAME;
        const production = productionData.get(stateName.toUpperCase());

        tooltip.style("visibility", "visible").html(`
            <strong>${stateName}</strong><br/>
            ${
              production
                ? `Production: ${d3.format(",")(production)} thousand cwt`
                : "No production data available"
            }
          `);

        const { left, top } = positionTooltip(event);
        tooltip.style("left", left + "px").style("top", top + "px");
      })
      .on("mousemove", (event) => {
        const { left, top } = positionTooltip(event);
        tooltip.style("left", left + "px").style("top", top + "px");
      })
      .on("mouseout", () => {
        tooltip.style("visibility", "hidden");
      });

    const legendWidth = 300;
    const legendHeight = 20;

    const legendScale = d3
      .scaleLinear()
      .domain(colorScale.domain())
      .range([0, legendWidth]);

    const legendAxis = d3
      .axisBottom(legendScale)
      .tickFormat(d3.format(",.0f"))
      .ticks(5);

    const defs = svg.append("defs");

    const linearGradient = defs
      .append("linearGradient")
      .attr("id", "legend-gradient")
      .attr("x1", "0%")
      .attr("x2", "100%")
      .attr("y1", "0%")
      .attr("y2", "0%");

    const steps = 10;
    for (let i = 0; i <= steps; i++) {
      const value = i / steps;
      linearGradient
        .append("stop")
        .attr("offset", `${value * 100}%`)
        .attr("stop-color", colorScale(value * colorScale.domain()[1]));
    }

    legendGroup
      .append("rect")
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .style("fill", "url(#legend-gradient)");

    legendGroup
      .append("g")
      .attr("transform", `translate(0, ${legendHeight})`)
      .call(legendAxis)
      .selectAll("text")
      .style("font-size", "12px")
      .attr("dy", "0.8em");

    legendGroup
      .append("text")
      .attr("x", 0)
      .attr("y", -5)
      .text("Potato Production (thousand cwt)")
      .style("font-size", "12px");

    statesGroup
      .transition()
      .duration(500)
      .style("opacity", 1)
      .transition()
      .duration(500)
      .selectAll("path")
      .attr("fill", (d) => {
        const stateName = d.properties.NAME.toUpperCase();
        const production = productionData.get(stateName);
        return production ? colorScale(production) : "#f0f0f0";
      });

    legendGroup.transition().duration(500).style("opacity", 1);
  });
}
