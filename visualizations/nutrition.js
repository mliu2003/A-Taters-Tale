function drawNutrition(svg, dimensions) {
  const { width, height } = dimensions;

  // Sample data
const data = [
  { name: 'A', value: 30 },
  { name: 'B', value: 80 },
  { name: 'C', value: 45 },
  { name: 'D', value: 60 },
  { name: 'E', value: 20 },
  { name: 'F', value: 90 },
  { name: 'G', value: 55 }
];

// Define the margin and the plot area
const margin = { top: 20, right: 30, bottom: 40, left: 40 };
const chartWidth = (width - margin.left - margin.right) * 0.8;
const chartHeight = (height - margin.top - margin.bottom) * 0.8;

// Create a group element to contain the chart
const g = svg.append("g")
.attr("transform", `translate(${(width - chartWidth) / 2}, ${(height - chartHeight) / 2})`);

// Define the x scale (for categorical data)
const x = d3.scaleBand()
  .domain(data.map(d => d.name)) // Set domain as the names
  .range([0, chartWidth])
  .padding(0.1); // Padding between bars

// Define the y scale (for numerical data)
const y = d3.scaleLinear()
  .domain([0, d3.max(data, d => d.value)]) // Set domain from 0 to the max value
  .nice() // Round the domain for nice axis ticks
  .range([chartHeight, 0]); // Invert y scale to have the origin at the bottom

// Append the bars to the chart
g.selectAll(".bar")
  .data(data)
  .enter().append("rect")
  .attr("class", "bar")
  .attr("x", d => x(d.name)) // Set the x position based on the name
  .attr("y", d => y(d.value)) // Set the y position based on the value
  .attr("width", x.bandwidth()) // Width of each bar
  .attr("height", d => chartHeight - y(d.value)); // Height is the difference from the top of the SVG

// Add the x-axis
g.append("g")
  .attr("class", "x-axis")
  .attr("transform", `translate(0, ${chartHeight})`) // Move the x-axis to the bottom
  .call(d3.axisBottom(x))
  .selectAll(".tick text") // Style the text for the x-axis labels
  .attr("class", "axis-label")
  .style("text-anchor", "middle");

// Add the y-axis
g.append("g")
  .attr("class", "y-axis")
  .call(d3.axisLeft(y))
  .selectAll(".tick text") // Style the text for the y-axis labels
  .attr("class", "axis-label")
  .style("text-anchor", "middle");
 
}