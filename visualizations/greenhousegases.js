function drawGreenhouseGasEmissions(svg, dimensions) {
    const { width, height } = dimensions;
    const padding = 50;
    const circleRadius = 40; 
    const columns = 4; 
    const maxSize = 230


    d3.csv("data/greenhouse-gas-emissions-per-kilogram-of-food-product.csv").then((rawData) => {
        const gasEmissions = rawData.map((row) =>
            greenhouseGasDataPreprocessor(row)
        );

        console.log(gasEmissions)

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
            .attr("x", (d, i) => positions[i].x)
            .attr("y", (d, i) => positions[i].y)
            .attr("width", d => radiusScale(d.emissions_per_kg))
            .attr("height", d => radiusScale(d.emissions_per_kg))
            .attr("href", "images/gas-cloud-drawing.png")
            .each(function (d, i) {
                const size = radiusScale(d.emissions_per_kg);
                // console.log(size)
                d3.select(this)
                    .attr("x", positions[i].x + 100 / 2 - size / 2)
                    .attr("y", positions[i].y + 100 / 2 - size / 2);
            })
            .transition()
            .duration(2000) // Animation duration
            .ease(d3.easeLinear) // Linear movement
            .attr("x", (d, i) => positions[i].x + 100 / 2 - radiusScale(d.emissions_per_kg) / 2) // Final x
            .attr("y", (d, i) => positions[i].y + 100 / 2 - radiusScale(d.emissions_per_kg) / 2) // Final y
            .on("end", () => console.log("Animation completed")); // Debug
        

        const labels = svg.selectAll("text")
            .data(gasEmissions)
            .enter()
            .append("text")
            .attr("x", (d, i) => positions[i].x + 100 / 2) 
            .attr("y", (d, i) => positions[i].y + 100 / 2)
            .attr("text-anchor", "middle")
            .attr("font-size", "12px")
            .attr("fill", "white")
            .text(d => d.name)
            .transition() // Fade in
            .delay(200) // Small delay
            .duration(2000)
            .style("opacity", 1);;
        
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
                .attr("stroke-width", 3);
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
            .attr("fill", "black")
            .lower()
        
  

    })
}