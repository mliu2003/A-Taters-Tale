function drawGreenhouseGasEmissions(svg, dimensions) {
    const { width, height } = dimensions;
    const padding = 50;
    const circleRadius = 40; 
    const columns = 4; 
    const maxSize = 230

    svg.selectAll("*").remove();
    var brush = d3.brush().extent([
        [0, 0],
        [width, height],
      ]);


    d3.csv("data/greenhouse-gas-emissions-per-kilogram-of-food-product.csv").then((rawData) => {
        const gasEmissions = rawData.map((row) =>
            greenhouseGasDataPreprocessor(row)
        );

        var toolTip = d3
        .tip()
        .attr("class", "d3-tip")
        // .offset([-12, -10])
        .html(function (event, d) {
          return `<div>
          <h5>${d.name}</h5>
          <p>Emissions per kilogram planted: ${d.emissions_per_kg} kg of GHG</p>
        </div>`;
        });

        svg.call(toolTip);

        var radiusScale = d3.scaleSqrt()
            .domain([0, d3.max(gasEmissions, d => d.emissions_per_kg)])
            .range([50, maxSize]);
        
        var cols_skipped = 0
        
        const positions = gasEmissions.map((d, i) => {
            const size = radiusScale(d.emissions_per_kg);
            console.log(size)
            var col = (i + cols_skipped) % columns; 
            var row = Math.floor((i + cols_skipped) / columns);
            if (size > 170) {
                cols_skipped += 1
                col = (i + cols_skipped) % columns;
                row = Math.floor((i + cols_skipped) / columns);
            } 
            const x = col * (2 * circleRadius + padding) + circleRadius + padding + 150;
            const y = row * (2 * circleRadius + padding) + circleRadius - 10;
            return { x, y };
            });

        const images = svg.selectAll("image")
            .data(gasEmissions)
            .enter()
            .append("image")
            .attr("href", "images/gas-cloud-drawing.png")
            .attr("x", (d, i) => positions[i].x) 
            .attr("y", (d, i) => positions[i].y + 200) 
            .attr("width", 0)
            .attr("height", 0) 
            .transition() 
            .duration(2000) 
            .each(function (d, i) {
                const size = radiusScale(d.emissions_per_kg);
                d3.select(this)
                    .attr("x", positions[i].x + 100 / 2 - size / 2)
                    .attr("y", positions[i].y + 100 / 2 - size / 2);
            })
            .attr("width", d => radiusScale(d.emissions_per_kg))
            .attr("height", d => radiusScale(d.emissions_per_kg))
          
        

        const labels = svg.selectAll("text")
            .data(gasEmissions)
            .enter()
            .append("text")
            .on("mouseover", toolTip.show)
            .on("mouseout", toolTip.hide)
            .attr("x", (d, i) => positions[i].x + 100 / 2) 
            .attr("y", (d, i) => positions[i].y + 100 / 2)
            .attr("text-anchor", "middle")
            .attr("font-size", "12px")
            .attr("fill", "white")
            .attr("opacity", 0)
            .text(d => d.name)
            .transition() 
            .delay(200) 
            .duration(2000)
            .style("opacity", 1);
        
        const potatoData = gasEmissions.find(d => d.name === "Potatoes");
        const potatoIndex = gasEmissions.indexOf(potatoData);

      
            

        if (potatoData) {
            const potatoPosition = positions[potatoIndex];
            const circleRadius = 30; 
        
            svg.append("circle")
                .attr("cx", potatoPosition.x + 50) 
                .attr("cy", potatoPosition.y + 50) 
                .attr("r", circleRadius)
                .attr("fill", "none")
                .attr("stroke", "red")
                .attr("stroke-width", 3)
                .attr("opacity", 0)
                .transition()
                .delay(200)
                .duration(2000)
                .style("opacity", 1)
        }

        svg.append("image")
            .attr("x", 0)
            .attr("y", height * 0.6)
            .attr("width", width * 1.2)
            .attr("height", height ) 
            .attr("href", "images/half-earth.png") 
            .lower()

        svg.append("rect")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("fill", "rgb(140, 82, 45)")
            .lower()
            .transition()
            .duration(2000)
            .attr("fill", "black");
            

    })
}