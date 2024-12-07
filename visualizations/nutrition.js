const data = {
  "Potassium (mg)": [
    { name: 'Potatoes', value: 620 },
    { name: 'Bread', value: 173 },
    { name: 'Rice', value: 53 },
    { name: 'Pasta', value: 36 },
  ],
  "Vitamin C (mg)": [
    { name: 'Potatoes', value: 27 },
    { name: 'Bread', value: 0 },
    { name: 'Rice', value: 0 },
    { name: 'Pasta', value: 0 },
  ],
  "Fiber (g)": [
    { name: 'Potatoes', value: 2.8 },
    { name: 'Bread', value: 4.1 },
    { name: 'Rice', value: 0.6 },
    { name: 'Pasta', value: 1.8 },
  ],
  "Calories": [
    { name: 'Potatoes', value: 116 },
    { name: 'Bread', value: 398 },
    { name: 'Rice', value: 195 },
    { name: 'Pasta', value: 197 },
  ]
};

const pastelColors = [
  "#6F4E37",
  "#A67B5B",
  "#ECB176",
  "#efccaa",
];

function drawNutrition(svg, dimensions) {
  const { width, height } = dimensions;

  const options = [
    { value: "Potassium (mg)", label: "Potassium" },
    { value: "Vitamin C (mg)", label: "Vitamin C" },
    { value: "Fiber (g)", label: "Fiber" },
    { value: "Calories", label: "Calories" },
  ];

  updateMacro(svg, dimensions, "Potassium (mg)")

  const margin = { top: 20, right: 30, bottom: 40, left: 40 };
  const chartWidth = (width - margin.left - margin.right) * 0.8;
  const chartHeight = (height - margin.top - margin.bottom) * 0.8;

  const selectNutrient = d3.select(".graphic")
    .append("div")
    .attr("class", "radio-buttons")
    .style("position", "absolute")
    .style("bottom", "20px")
    .style("left", `${(width - chartWidth) / 2}px`)
    .style("width", `${chartWidth}px`)
    .style("text-align", "center");

  selectNutrient.selectAll("div")
    .data(options)
    .enter()
    .append("div")
    .style("display", "inline-block")
    .style("margin-right", "20px")
    .each(function (d, i) {
      const group = d3.select(this);

      group.append("input")
        .attr("type", "radio")
        .attr("name", "radio-group")
        .attr("value", d.value)
        .property("checked", d.value === "Potassium (mg)");

      group.append("label")
        .attr("for", d.value)
        .text(d.label)
        .style("font-size", "14px");
    });

  selectNutrient.selectAll("input[type='radio']").on("change", function () {
    updateMacro(svg, dimensions, this.value);
  });

}

function updateMacro(svg, dimensions, selected) {
  const { width, height } = dimensions;
  const margin = { top: 20, right: 30, bottom: 40, left: 40 };
  const chartWidth = (width - margin.left - margin.right) * 0.8;
  const chartHeight = (height - margin.top - margin.bottom) * 0.8;

  const g = svg.selectAll("g.chart-group").data([null]);
  const gEnter = g.enter().append("g").attr("class", "chart-group")
    .attr("transform", `translate(${(width - chartWidth) / 2}, ${(height - chartHeight) / 2})`);

  const gGroup = g.merge(gEnter);

  const x = d3.scaleBand()
    .domain(data[selected].map(d => d.name))
    .range([0, chartWidth])
    .padding(0.1);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data[selected], d => d.value)])
    .nice()
    .range([chartHeight, 0]);

  const bars = gGroup.selectAll(".bar")
    .data(data[selected]);

  bars.enter().append("rect")
    .attr("class", "bar")
    .attr("x", d => x(d.name))
    .attr("y", chartHeight)
    .attr("width", x.bandwidth())
    .attr("height", 0)
    .attr('fill', (d, i) => pastelColors[i])
    .transition()
    .duration(650)
    .ease(d3.easeQuadOut)
    .attr("y", d => y(d.value))
    .attr("height", d => chartHeight - y(d.value));

  bars.transition()
    .duration(300)
    .ease(d3.easeQuadOut)
    .attr("x", d => x(d.name))
    .attr("y", d => y(d.value))
    .attr("height", d => chartHeight - y(d.value));

  bars.exit().transition()
    .duration(300)
    .ease(d3.easeQuadOut)
    .attr("y", chartHeight)
    .attr("height", 0)
    .remove();

  const xAxis = gGroup.selectAll(".x-axis")
    .data([null]);
  const xAxisEnter = xAxis.enter().append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(d3.axisBottom(x));

  xAxisEnter.merge(xAxis)
    .call(d3.axisBottom(x))
    .selectAll(".tick text")
    .attr("class", "axis-label")
    .style("text-anchor", "middle");

  const yAxis = gGroup.selectAll(".y-axis")
    .data([null]);
  const yAxisEnter = yAxis.enter().append("g")
    .attr("class", "y-axis")
    .call(d3.axisLeft(y));

  yAxisEnter.merge(yAxis)
    .call(d3.axisLeft(y))
    .selectAll(".tick text")
    .attr("class", "axis-label")
    .style("text-anchor", "left");

  svg.selectAll(".y-axis-label").remove();

  gGroup.selectAll(".y-axis-label")
    .data([null])
    .enter().append("text")
    .attr("class", "y-axis-label")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left - 20)
    .attr("x", -chartHeight / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-weight", "bold")
    .text(selected);
}
