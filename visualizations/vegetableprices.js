function drawVegetablePrices(svg, dimensions) {
  const vegetables = [
    {
      name: "Potatoes",
      value: 0.8166,
      imagePath: "images/vegetables/potato.png",
    },
    {
      name: "Tomatoes",
      value: 2.1868,
      imagePath: "images/vegetables/tomato.png",
    },
    {
      name: "Broccoli",
      value: 2.9162,
      imagePath: "images/vegetables/broccoli.png",
    },
    { name: "Corn", value: 2.2281, imagePath: "images/vegetables/corn.png" },
  ];

  const options = [
    { value: "10", label: "$10" },
    { value: "50", label: "$50" },
    { value: "100", label: "$100" },
  ];

  const selectMoney = d3
    .select(".graphic")
    .append("div")
    .attr("class", "radio-buttons");

  selectMoney
    .append("text")
    .attr("text-anchor", "middle")
    .attr("font-size", "24px")
    .attr("fill", "black")
    .style("font-weight", "bold")
    .attr("id", "brand-label")
    .text("How much vegetable can I buy for");

  selectMoney
    .selectAll("div")
    .data(options)
    .enter()
    .append("div")
    .attr("class", "radio-button-group")
    .each(function (d, i) {
      const group = d3.select(this);
      group
        .append("input")
        .attr("type", "radio")
        .attr("name", "radio-group")
        .attr("value", d.value)
        .attr("checked", i === 2);

      group.append("label").text(d.label).attr("for", d.value);
    });

  selectMoney.selectAll("input[type='radio']").on("change", function () {
    update(svg, dimensions, vegetables, this.value);
  });

  selectMoney
    .append("text")
    .attr("text-anchor", "middle")
    .attr("font-size", "24px")
    .attr("fill", "black")
    .style("font-weight", "bold")
    .attr("id", "brand-label")
    .text("?");

  update(svg, dimensions, vegetables, 100);
}

function update(svg, dimensions, vegetables, money) {
  svg.selectAll("*").remove();
  var g = svg.append("g");
  const { width, height } = dimensions;
  var prevWidth = 0;
  vegetables.forEach((veg) => {
    const name = veg.name;
    const value = veg.value;
    const imagePath = veg.imagePath;

    g.append("text")
      .attr("text-anchor", "middle")
      .attr("font-size", "18px")
      .attr("fill", "black")
      .style("font-weight", "bold")
      .attr("id", "brand-label")
      .text((money / value).toFixed(2) + "lbs. of " + name)
      .attr("x", (width / 7) + prevWidth)
      .attr("y", (height * 3) / 4)
      .style("opacity", 1);

    const numToShow = Math.floor(money / value / (money == 100 ? 5 : money == 50 ? 4 : 1));
    const img_g = g.append("g");
    const size = width / 20;
    for (let i = 0; i < numToShow; i++) {
      const img = img_g
        .append("image")
        .attr("href", imagePath)
        .attr("width", width / 10)
        .attr("height", height / 10)
        .attr("x", size + prevWidth + (i % 3) * size)
        .attr("y", -200)
        .style("opacity", 0);
      img
        .transition()
        .duration(1000 - i * 100)
        .ease(d3.easeCubicInOut)
        .attr("y", () => {
          return (
            height * 0.6 - numToShow * 10 + (30 * i) / 3 - Math.random(3) * 30
          );
        })
        .style("opacity", 1);
    }

    prevWidth += width / 4;
  });
}
