function drawTruck(svg, dimensions) {
  const { width, height } = dimensions;

  const scaledWidth = width;
  const scaledHeight = height;
  const old = svg.selectAll("*:not(.truck)");
  old.transition().duration(1500).style("opacity", 0);
  var g = svg.append("g").attr("class", "truck");
  g.append("image")
    .attr("href", "images/truck.png")
    .attr("width", scaledWidth)
    .attr("height", scaledHeight)
    .attr("x", width)
    .style("opacity", 0);

  g.selectAll("image")
    .transition()
    .duration(1000)
    .ease(d3.easeCubicInOut)
    .attr("x", () => {
      return 0;
    })
    .style("opacity", 1);
}

function removeTruckOrAll(svg, dimensions) {
  const { width, height } = dimensions;
  const truck = svg.select(".truck");
  if (truck.empty()) {
    svg.selectAll("*").remove();
  } else {
    truck
      .transition()
      .duration(1000)
      .ease(d3.easeCubicInOut)
      .attr("transform", `translate(${-width}, 0)`)
      .style("opacity", 0);
  }
}
