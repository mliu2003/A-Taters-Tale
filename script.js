const steps = d3.selectAll(".step");
const svg = d3.select("svg");
const width = svg.node().clientWidth;
const height = svg.node().clientHeight;

svg
  .append("circle")
  .attr("cx", width / 2)
  .attr("cy", height / 2)
  .attr("r", 50)
  .style("fill", "steelblue");

const dimensions = {
  width: width / 2,
  height: height / 2,
};

drawVegetablePrices(svg, dimensions);

const updateVisualization = (stepIndex) => {
  console.log(`Step ${stepIndex + 1} active`);
  svg
    .select("circle")
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

// ********* data preprocessors *********//

// "Entity" attr has been reassigned to "name". Code field is also omitted as it is empty. Year and time has also been omitted as it is always 2010
function greehouseGasDataPreprocessor(row) {
  return {
    name: row["Entity"],
    emissions_per_kg: row["GHG emissions per kilogram (Poore & Nemecek, 2018)"],
  };
}

// "Vegetable" attr has been reassigned to name. "RetailPriceUnit" is always per pound, so this has been omitted
function vegetablePriceDataPreprocessor(row) {
  return {
    name: row["Vegetable"],
    form: row["Form"],
    retail_price_per_lb: row["RetailPrice"],
    yield: row["Yield"],
    cup_equivalent_size: row["CupEquivalentSize"],
    cup_equivalent_price: row["CupEquivalentPrice"],
  };
}

// "Entity" attr has been reassigned to "name". Code field is also omitted as it is empty. Year has also been omitted as it is always 2010
function landUseDataPreprocessor(row) {
  return {
    name: row["Entity"],
    land_use_per_kg: row["Land use per kilogram (Poore & Nemecek, 2018)"],
  };
}
