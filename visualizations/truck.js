function drawTruck(svg, dimensions) {
  const { width, height } = dimensions;

  const scaledWidth = width;
  const scaledHeight = height;
  const old = svg.selectAll("*:not(.truck)");
  d3.select(".radio-buttons").remove();
  old.transition().duration(1500).style("opacity", 0);
  var g = svg.append("g").attr("class", "truck");
  const image = g
    .append("image")
    .attr("href", "images/truck.png")
    .attr("width", scaledWidth)
    .attr("height", scaledHeight)
    .attr("x", width)
    .style("opacity", 0);

  const imageRect = image.node().getBoundingClientRect();

  const facts = d3
    .select("body")
    .append("div")
    .attr("class", "overlay")
    .style("position", "absolute")
    .style("height", `${scaledHeight}px`)
    .style("width", `${scaledWidth}px`)
    .style("left", `${imageRect.left - width}px`)
    .style("top", `${imageRect.top}px`);

  facts.style("opacity", 0);

  const newSvg = facts
    .append("svg")
    .attr("width", `${scaledWidth}px`)
    .attr("height", `${scaledHeight}px`);

  generateFact(
    newSvg,
    (scaledWidth * 1) / 4,
    scaledHeight / 2,
    "Most potatoes are transported in 40-foot enclosed vans. These potatoes are often grouped together into 2,000-3,000 pound crates or totes.",
    scaledHeight,
    scaledWidth
  );

  generateFact(
    newSvg,
    (scaledWidth * 1) / 2,
    scaledHeight / 2,
    "The Big Idaho Potato Truck has been running since 2012 to celebrate the 75th Anniversary of the Idaho Potato Commission! Now, it continues to travel the country every year!",
    scaledHeight,
    scaledWidth
  );

  generateFact(
    newSvg,
    (scaledWidth * 3) / 4,
    scaledHeight / 2,
    "The Big Idaho Potato Truck carries a potato that is 4 tons in weight! You would need about 21562 average sized potatoes to achieve the same weight!",
    scaledHeight,
    scaledWidth
  );

  facts.transition().duration(1000).ease(d3.easeCubicInOut).style("opacity", 1);

  g.selectAll("image")
    .transition()
    .duration(1000)
    .ease(d3.easeCubicInOut)
    .attr("x", () => {
      return 0;
    })
    .style("opacity", 1);
}

function generateFact(svg, cx, cy, text, scaledHeight, scaledWidth) {
  const circle = svg
    .append("circle")
    .attr("cx", cx)
    .attr("cy", cy)
    .attr("r", 40)
    .style("fill", "gray")
    .style("stroke", "red")
    .style("stroke-width", 2)
    .style("opacity", 0.5)
    .style("cursor", "pointer");

  const textBox = svg
    .append("g")
    .attr("class", "text-box")
    .style("visibility", "hidden")
    .style("text-anchor", "middle");

  const boxHeight = (scaledHeight * 1) / 4;

  const textBoxRect = textBox.append("rect");

  const textWidth = scaledWidth / 4;

  const textBoxText = textBox
    .append("text")
    .style("font-size", "14px")
    .style("fill", "black")
    .text(text)
    .attr("x", cx)
    .attr("y", cy - boxHeight)
    .attr("z-index", 1)
    .call(wrapText, textWidth);

  const textHeight = textBoxText.node().getBoundingClientRect().height + 20;

  const rectWidth = textWidth + 20;
  textBoxRect
    .attr("width", textWidth + 20)
    .attr("height", textHeight)
    .style("fill", "white")
    .style("stroke", "black")
    .style("stroke-width", 1)
    .attr("x", cx - rectWidth / 2)
    .attr("y", cy - (boxHeight + 50 / 2));

  circle.on("click", function () {
    if (textBox.style("visibility") == "visible") {
      textBox.style("visibility", "hidden");
    } else {
      d3.selectAll(".text-box").style("visibility", "hidden");
      textBox.style("visibility", "visible");
    }
  });
}

function wrapText(text, width) {
  text.each(function () {
    const textEl = d3.select(this);
    const words = textEl.text().split(/\s+/).reverse();
    let word;
    let line = [];
    let lineNumber = 0;
    const lineHeight = 1.1;
    const x = textEl.attr("x");
    const y = textEl.attr("y");
    let tspan = textEl.text(null).append("tspan").attr("x", x).attr("y", y);
    while ((word = words.pop())) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = textEl
          .append("tspan")
          .attr("x", x)
          .attr("y", y)
          .attr("dy", `${++lineNumber * lineHeight}em`)
          .text(word);
      }
    }
  });
}

function removeTruckOrAll(svg, dimensions) {
  const { width, height } = dimensions;
  d3.select(".radio-buttons").remove();
  d3.selectAll(".overlay").remove();
  const truck = svg.select(".truck");
  if (truck.empty()) {
    svg.selectAll("*").remove();
  } else {
    truck
      .transition()
      .duration(1000)
      .ease(d3.easeCubicInOut)
      .attr("transform", `translate(${-width}, 0)`)
      .style("opacity", 0)
      .remove();
  }
}
