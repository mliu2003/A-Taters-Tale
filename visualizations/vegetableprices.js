function drawVegetablePrices(svg, dimensions) {
  const { width, height } = dimensions;

  //temp
  const shift = 100;

  d3.csv("data/vegetable-prices-2022.csv").then((rawData) => {
    const vegetablePrices = rawData.map((row) =>
      vegetablePriceDataPreprocessor(row)
    );

    console.log(vegetablePrices);
    const xScale = d3
      .scaleBand()
      .domain(vegetablePrices.map((d) => d.name))
      .range([0, width * 3 / 4])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(vegetablePrices, (d) => d.retail_price_per_lb)])
      .nice()
      .range([height / 2, 0]);

    const chart = svg
      .append("g")
      .attr("transform", `translate(${shift},${height / 8})`);

    const xAxis = chart
      .append("g")
      .attr("transform", `translate(0,${height / 2})`)
      .call(d3.axisBottom(xScale));

    const yAxis = chart.append("g").call(d3.axisLeft(yScale));

    xAxis
    .selectAll(".tick text")
    .style("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("dx", -10)
    .attr("dy", 10);

    const line = d3
      .line()
      .x((d) => xScale(d.name))
      .y((d) => yScale(d.retail_price_per_lb));

    chart
      .append("path")
      .datum(vegetablePrices)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("d", line);

    // chart
    //   .selectAll(".dot")
    //   .data(vegetablePrices)
    //   .join("circle")
    //   .attr("class", "dot")
    //   .attr("cx", (d) => xScale(d.name))
    //   .attr("cy", (d) => yScale(d.retail_price_per_lb))
    //   .attr("r", 4)
    //   .attr("fill", "steelblue")
    //   .attr("stroke", "white")
    //   .attr("stroke-width", 2);
  });
}
