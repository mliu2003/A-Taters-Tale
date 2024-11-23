// D3 Scrollytelling Script
const steps = d3.selectAll(".step");
const svg = d3.select("svg");
const width = svg.node().clientWidth;
const height = svg.node().clientHeight;

// Example visualization setup
svg.append("circle")
  .attr("cx", width / 2)
  .attr("cy", height / 2)
  .attr("r", 50)
  .style("fill", "steelblue");

const updateVisualization = (stepIndex) => {
  console.log(`Step ${stepIndex + 1} active`);
  svg.select("circle")
    .transition()
    .duration(500)
    .attr("r", 50 + stepIndex * 20)
    .style("fill", d3.schemeCategory10[stepIndex]);
};

// Intersection observer for scroll events
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const index = +entry.target.dataset.step - 1;
      if (entry.isIntersecting) {
        steps.classed("active", false);
        d3.select(entry.target).classed("active", true);
        updateVisualization(index);
      }
    });
  },
  { threshold: 0.5 }
);

// Observe each step
steps.each(function () {
  observer.observe(this);
});
