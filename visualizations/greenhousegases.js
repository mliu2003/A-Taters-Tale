function drawGreenhouseGasEmissions(svg, dimensions) {
  const { width, height } = dimensions;
  const padding = 50;
  const circleRadius = 40;
  const columns = 4;
  const maxSize = 230;

  d3.csv("data/greenhouse-gas-emissions-per-kilogram-of-food-product.csv").then(
    (rawData) => {
      const gasEmissions = rawData.map((row) =>
        greenhouseGasDataPreprocessor(row)
      );

      var radiusScale = d3
        .scaleSqrt()
        .domain([0, d3.max(gasEmissions, (d) => d.emissions_per_kg)])
        .range([50, maxSize]);

      var cols_skipped = 0;

      const positions = gasEmissions.map((d, i) => {
        const size = radiusScale(d.emissions_per_kg);
        var col = (i + cols_skipped) % columns;
        var row = Math.floor((i + cols_skipped) / columns);
        if (size > 150) {
          cols_skipped += 1;
          col = (i + cols_skipped) % columns;
          row = Math.floor((i + cols_skipped) / columns);
        }
        const x =
          col * (2 * circleRadius + padding) + circleRadius + padding + 150;
        const y = row * (2 * circleRadius + padding) + circleRadius - 10;
        return { x, y };
      });

      const images = svg
        .selectAll("image")
        .data(gasEmissions)
        .enter()
        .append("image")
        .attr("x", (d, i) => positions[i].x)
        .attr("y", (d, i) => positions[i].y)
        .attr("width", (d) => radiusScale(d.emissions_per_kg))
        .attr("height", (d) => radiusScale(d.emissions_per_kg))
        .attr("href", "images/gas-cloud-drawing.png")
        .each(function (d, i) {
          // Center the image based on its scaled size
          const size = radiusScale(d.emissions_per_kg);
          d3.select(this)
            .attr("x", positions[i].x + 100 / 2 - size / 2)
            .attr("y", positions[i].y + 100 / 2 - size / 2);
        });

      const labels = svg
        .selectAll("text")
        .data(gasEmissions)
        .enter()
        .append("text")
        .attr("x", (d, i) => positions[i].x + 100 / 2)
        .attr("y", (d, i) => positions[i].y + 100 / 2)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("fill", "white")
        .text((d) => d.name);

      const potatoData = gasEmissions.find((d) => d.name === "Potatoes");
      const potatoIndex = gasEmissions.indexOf(potatoData);

      if (potatoData) {
        const potatoPosition = positions[potatoIndex];
        const circleRadius = 30;

        svg
          .append("circle")
          .attr("cx", potatoPosition.x + 50)
          .attr("cy", potatoPosition.y + 50)
          .attr("r", circleRadius)
          .attr("fill", "none")
          .attr("stroke", "red")
          .attr("stroke-width", 3);
      }

      svg
        .append("image")
        .attr("x", 0)
        .attr("y", -50)
        .attr("width", width + 50) // Match the canvas width
        .attr("height", height + 100) // Match the canvas height
        .attr("href", "images/ozone-drawing.jpg") // Path to the background image
        .lower(); // Send the background image behind other elements
    }
  );
}
