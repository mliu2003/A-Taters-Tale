function drawChips(svg, dimensions) {
    const { width, height } = dimensions;
    const scaleFactor = 3.5;
    const chipWidth = width / 13;
    const chipHeight = height / 8;
    const chips_data = {
        "Lays": [4271.49, 'images/layschips.png'],
        "Ruffles": [1942.65, 'images/ruffies.png'],
        "Pringles": [1412.04, 'images/pwingles.png'],
        // "Private Label": 991.5,
        "Utz": [458.77, 'images/utz.png'],
        "Cape Cod": [402.2, 'images/cape-cod.png'],
        // "Kettle": 332.36,
        // "Herr's": 158.17,
        // "Barcel": 102.4,
        // "Wise": 99.92,
    }
    
    const maxValue = d3.max(Object.values(chips_data), d => d[0]);
    const offsetY = (height - chipHeight) / 2;
    var g = svg.append('g')
    var prevWidth = 0
    // Loop through each brand and create a colored section for each
    Object.entries(chips_data).forEach(([brand, [value, imagePath]], index) => {
        const scaledWidth = chipWidth * (value / maxValue) * scaleFactor;
        const scaledHeight = chipHeight * (value / maxValue) * scaleFactor;
        var img_g = g.append('g')
        var image = img_g.append('image')
            .attr("href", imagePath)
            .attr('width', scaledWidth)
            .attr('height', scaledHeight)
            .attr('x', width/7+prevWidth)
            .attr('y', -scaledHeight)
            .style("opacity", 0);
        g.append('text')
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .attr('fill', 'black')
            .text(brand)
            .attr('x', width/7+prevWidth + (scaledWidth/2))
            .attr('y', -250)
            .style("opacity", 0);
        prevWidth += scaledWidth + 30;
    });
    var maxHeight = chipHeight * scaleFactor;
    function animateChipBags() {
        g.selectAll('image')
            .data(Object.entries(chips_data))
            .transition()
            .duration(1000)  // Animation duration
            .ease(d3.easeBounceOut)  // Ease effect (bounce when falling)
            .attr('y', function(d, i) {
                var brand = d[0];
                var value = d[1][0];
                const scaledWidth = chipWidth * (value / maxValue) * scaleFactor;
                const scaledHeight = chipHeight * (value / maxValue) * scaleFactor;
                return height/4 + (maxHeight - scaledHeight);
            })      // Move to the centered vertical position
            .style("opacity", 1);    // Fade in the image

        g.selectAll('text')
            .transition()
            .duration(1000)
            .ease(d3.easeBounceOut)
            .attr('y', offsetY + chipHeight + 115)  // Position text just below the image
            .style("opacity", 1);  // Fade in the text
    }
    return animateChipBags;

}
