function drawPotatoTypes(svg, dimensions) {
    const { width, height } = dimensions;
    const chartWidth = 800; 
    const chartHeight = 500; 
    const offsetX = (width - chartWidth) / 2;
    const offsetY = (height - chartHeight) / 2;

    d3.csv("data/potatotypes.csv").then((rawData) => {
        var map = new Map();
        for (let i = 0; i < rawData.length; i++) {
            var curr_variety = rawData[i]["Variety"]
            var curr_val = Number(rawData[i]["Number of Stores"])
            if (map.has(curr_variety)) {
                map.set(curr_variety, map.get(curr_variety) + curr_val)
            } else {
                map.set(curr_variety, curr_val)
            }
        }
        
        map = new Map([...map.entries()].sort((a, b) => b[1] - a[1]))
        console.log(map)
        const parsedData = Array.from(map.entries()).map(([key, value]) => ({
            name: key,
            value: value 
          }));
        
        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(parsedData, d => d.value)])
            .range([chartHeight, 0]);

        const xScale = d3.scaleBand()
            .domain(parsedData.map(d => d.name))
            .range([0, chartWidth])
            .padding(0.2);
        
  
        const chart = svg.append("g")
            .attr("transform", `translate(${offsetX}, ${offsetY})`);

        chart
            .append("g")
            .attr("transform", `translate(0, ${chartHeight})`) // Position at the bottom
            .call(d3.axisBottom(xScale))
            .selectAll("text")
            .style("text-anchor", "middle");

        chart
            .append("g")
            .call(d3.axisLeft(yScale));

        
        chart.selectAll(".bar")
            .data(parsedData)
            .enter()
            .append("image")
            .attr("class", "bar")
            .attr("x", d => xScale(d.name))
            .attr("y", d => yScale(d.value)) 
            .attr("width", xScale.bandwidth())
            .attr("height", d => chartHeight - yScale(d.value))
            .attr("href", "images/taller-sprout.png"); 

        chart.selectAll(".label")
            .data(parsedData)
            .enter()
            .append("text")
            .attr("x", d => xScale(d.name) + xScale.bandwidth() / 2)
            .attr("y", chartHeight + 15)
            .attr("text-anchor", "middle")
            .attr("font-size", "12px")
            .attr("fill", "black")
        
            svg.append("image")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", width )
            .attr("height", height ) 
            .attr("href", "images/farm-sky-background.jpg") 
            .lower()
        
    })
}