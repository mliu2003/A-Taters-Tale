function drawOutro(svg, dimensions) {
    const { width, height } = dimensions;
    console.log(width)
    console.log(height)
    const chartWidth = 600;
    const chartHeight = 500;
    const offsetX = (width - chartWidth) / 2;
    const offsetY = (height - chartHeight) / 2;
   
    const targetValue = 131000;

    const fontSize = 40; 

    const chart = svg
    .append("g")
    .attr("transform", `translate(${offsetX}, ${offsetY})`);

    chart.append('text')
        .attr('x', chartWidth/2)
        .attr('y', 0)
        .attr('text-anchor', 'middle')
        .attr('font-size', fontSize)
        .attr('dy', '.3em') 
        .text('Potatoes Wrapped')

    const firstRow = chart.append("g")

// Append a text element to the SVG
    const acreCount = firstRow.append('text')
        .attr('x', chartWidth/2)
        .attr('y', chartHeight/3)
        .attr('text-anchor', 'middle')
        .attr('font-size', fontSize)
        .attr('dy', '.3em') 
        .text(0)

    acreCount.transition()
        .duration(2000)
        .tween("text", function() {
            const that = d3.select(this);
            const i = d3.interpolateNumber(0, targetValue); 
            return function(t) {
                that.text(Math.round(i(t))); 
            };
        });
    
    firstRow.append("text")
        .attr('x', chartWidth/2)
        .attr('y', chartHeight/3 + fontSize)
        .attr('text-anchor', 'middle')
        .attr('font-size', 30)
        .attr('dy', '.3em')
        .text("Total acres of potatoes planted")

    const secondRow = chart.append("g")

    const russet = secondRow.append('text')
        .attr('x', 0)
        .attr('y', 2 * chartHeight/3)
        .attr('text-anchor', 'middle')
        .attr('font-size', fontSize)
        .attr('dy', '.3em') 
        .text('Russet')

   secondRow.append("text")
        .attr('x', 0)
        .attr('y', 2 * chartHeight/3 + fontSize)
        .attr('text-anchor', 'middle')
        .attr('font-size', 20)
        .attr('dy', '.3em')
        .text("Most popular variety grown")


    const idaho = secondRow.append('text')
        .attr('x', chartWidth/2)
        .attr('y', 2 * chartHeight/3)
        .attr('text-anchor', 'middle')
        .attr('font-size', fontSize)
        .attr('dy', '.3em') 
        .text('Idaho')

    secondRow.append("text")
        .attr('x', chartWidth/2)
        .attr('y', 2 * chartHeight/3 + fontSize)
        .attr('text-anchor', 'middle')
        .attr('font-size', 20)
        .attr('dy', '.3em')
        .text("Most potatoes planted")

    const fries = secondRow.append('text')
        .attr('x', chartWidth )
        .attr('y', 2 * chartHeight/3)
        .attr('text-anchor', 'middle')
        .attr('font-size', fontSize)
        .attr('dy', '.3em') 
        .text('French Fries')

    secondRow.append("text")
        .attr('x', chartWidth)
        .attr('y', 2 * chartHeight/3 + fontSize)
        .attr('text-anchor', 'middle')
        .attr('font-size', 20)
        .attr('dy', '.3em')
        .text("Most popular potato dish")

    thirdRow = chart.append("g")

    const calories = thirdRow.append('text')
        .attr('x', chartWidth/3)
        .attr('y', chartHeight - fontSize)
        .attr('text-anchor', 'middle')
        .attr('font-size', fontSize)
        .attr('dy', '.3em') 
        .text(0)

    calories.transition()
        .duration(2000)
        .tween("text", function() {
            const that = d3.select(this);
            const i = d3.interpolateNumber(0, 120); 
            return function(t) {
                that.text(Math.round(i(t))); 
            };
        });

    thirdRow.append("text")
        .attr('x', chartWidth/3)
        .attr('y', chartHeight)
        .attr('text-anchor', 'middle')
        .attr('font-size', 20)
        .attr('dy', '.3em')
        .text("Calories in a potato")

        const cost = thirdRow.append('text')
        .attr('x', 2.5 * chartWidth/3)
        .attr('y', chartHeight - fontSize)
        .attr('text-anchor', 'middle')
        .attr('font-size', fontSize)
        .attr('dy', '.3em') 
        .text(0)

    cost.transition()
        .duration(2000)
        .tween("text", function() {
            const that = d3.select(this);
            const i = d3.interpolateNumber(0, 122.64); 
            return function(t) {
                that.text(Math.round(i(t))); 
            };
        });

    thirdRow.append("text")
        .attr('x',  2.5 * chartWidth/3)
        .attr('y', chartHeight)
        .attr('text-anchor', 'middle')
        .attr('font-size', 20)
        .attr('dy', '.3em')
        .text("Pounds of potatoes for $100")


}