function drawPotatoDishChoices(svg, dimensions) {
  d3.json("data/potatodishes.json").then((products) => {
    // const potatoPopularityData = rawData.map((row) =>
    //   potatoPopularityDataPreprocessor(row)
    // );
    const { width, height } = dimensions;

    svg.selectAll("*").remove();

    svg
      .append("defs")
      .append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "0 0 10 10")
      .attr("refX", 5)
      .attr("refY", 5)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto-start-reverse")
      .append("path")
      .attr("d", "M 0 0 L 10 5 L 0 10 z")
      .attr("fill", "black");

    const centerX = width / 2;
    const centerY = height / 2;
    const centralImageWidth = 200;
    const centralImageHeight = 200;
    const margin = 20;
    const centralImageX = centerX - centralImageWidth / 2;
    const centralImageY = height - centralImageHeight - margin;
    const lineStartX = centralImageX + centralImageWidth / 2;
    const lineStartY = centralImageY;

    const radius = 400;

    svg
      .append("image")
      .attr("href", "images/start-potato-viz3.png")
      .attr("x", centralImageX)
      .attr("y", centralImageY)
      .attr("width", centralImageWidth)
      .attr("height", centralImageHeight);

    const productImageWidth = 150;
    const productImageHeight = 150;

    products.forEach((product) => {
      const angleRad = (product.angle * Math.PI) / 180;
      const endX = lineStartX + radius * Math.cos(angleRad);
      const endY = lineStartY + radius * Math.sin(angleRad);

      const imageBottomY = endY + 20 + productImageHeight / 2;

      const controlPointX = (lineStartX + endX) / 2;
      const controlPointY = lineStartY - 150;

      svg
        .append("path")
        .attr(
          "d",
          `M${lineStartX},${lineStartY} Q${controlPointX},${controlPointY} ${endX},${imageBottomY}`
        )
        .attr("stroke", "black")
        .attr("stroke-width", 4)
        .attr("fill", "none")
        .attr("marker-end", "url(#arrowhead)");

      svg
        .append("image")
        .attr("href", product.img)
        .attr("x", endX - productImageWidth / 2)
        .attr("y", endY - productImageHeight / 2)
        .attr("width", productImageWidth)
        .attr("height", productImageHeight)
        .style("cursor", "pointer")
        .on("click", function () {
          showPopup(product);
        });

      svg
        .append("text")
        .attr("x", endX)
        .attr("y", endY - productImageHeight / 2 - 10)
        .attr("text-anchor", "middle")
        .attr("font-size", "20px")
        .text(product.name)
        .attr("font-weight", "bold");
    });

    function showPopup(product) {
      d3.select(".popup").remove();

      const overlay = svg
        .append("rect")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "black")
        .style("opacity", 0);

      overlay.transition().duration(500).style("opacity", 0.5);

      const popupWidth = 600;
      const popupHeight = 450;

      const popup = svg
        .append("g")
        .attr("class", "popup")
        .attr(
          "transform",
          `translate(${centerX - popupWidth / 2}, ${
            centerY - popupHeight / 2
          }) scale(0)`
        )
        .style("opacity", 0);

      popup
        .transition()
        .duration(500)
        .attr(
          "transform",
          `translate(${centerX - popupWidth / 2}, ${
            centerY - popupHeight / 2
          }) scale(1)`
        )
        .style("opacity", 1);

      popup
        .append("rect")
        .attr("width", popupWidth)
        .attr("height", popupHeight)
        .attr("fill", "white")
        .attr("stroke", "black")
        .attr("rx", 10)
        .attr("ry", 10);

      popup
        .append("text")
        .attr("x", popupWidth - 20)
        .attr("y", 20)
        .attr("text-anchor", "end")
        .attr("font-size", "16px")
        .style("cursor", "pointer")
        .text("✖")
        .on("click", function () {
          overlay.transition().duration(500).style("opacity", 0).remove();
          popup
            .transition()
            .duration(500)
            .attr(
              "transform",
              `translate(${centerX - popupWidth / 2}, ${
                centerY - popupHeight / 2
              }) scale(0)`
            )
            .style("opacity", 0)
            .remove();
        });

      popup
        .append("text")
        .attr("x", popupWidth / 2)
        .attr("y", 50)
        .attr("text-anchor", "middle")
        .attr("font-size", "24px")
        .attr("font-weight", "bold")
        .text(product.name);

      const infoText = popup
        .append("text")
        .attr("x", popupWidth / 2)
        .attr("y", 80)
        .attr("text-anchor", "middle")
        .attr("font-size", "18px")
        .text(product.info)
        .call(wrapText, popupWidth);

      const textBBox = infoText.node().getBBox();
      const imageY = textBBox.y + textBBox.height + 20;
      const imageWidth = popupWidth - 40;
      const imageHeight = 200;

      popup
        .append("image")
        .attr("href", product.detailimg || product.img)
        .attr("x", 20)
        .attr("y", imageY)
        .attr("width", imageWidth)
        .attr("height", imageHeight);

      const popupImgHeight = imageY + imageHeight + 20;

      background.attr("height", popupImgHeight);

      popup.attr(
        "transform",
        `translate(${centerX - popupWidth / 2}, ${
          centerY - popupImgHeight / 2
        })`
      );
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
  });
}
