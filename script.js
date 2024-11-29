const svg = d3.select("svg");
const width = svg.node().clientWidth;
const height = svg.node().clientHeight;

const dimensions = {
  width: width / 2,
  height: height / 2,
};

const visualizations = [
  {
    drawFunction: drawVegetablePrices,
    label: "Vegetable Prices Visualization",
  },
  { drawFunction: drawNextVisualization, label: "Second Visualization" },
  { drawFunction: drawAnotherVisualization, label: "Third Visualization" },
];

const graphic = d3.select(".graphic");

visualizations.forEach((vis, index) => {
  graphic
    .append("div")
    .attr("class", "step")
    .attr("data-step", index)
    .text(vis.label);
});

const updateVisualization = (stepIndex) => {
  svg.selectAll("*").remove();
  console.log(`Step ${stepIndex} active`);
  switch (stepIndex) {
    case 0:
      drawVegetablePrices(svg, dimensions);
      break;
    case 1:
      drawNextVisualization(svg, dimensions);
      break;
    case 2:
      drawAnotherVisualization(svg, dimensions);
      break;
    case 3:
      // Call another drawing function if needed
      break;
    default:
      break;
  }
};

function drawNextVisualization(svg, dimensions) {
  // Replace this with your code for the second visualization
  svg
    .append("text")
    .attr("x", dimensions.width / 2)
    .attr("y", dimensions.height / 2)
    .text("Second Visualization")
    .style("text-anchor", "middle")
    .style("font-size", "24px");
}

// Example function for a third visualization (step 3)
function drawAnotherVisualization(svg, dimensions) {
  // Replace this with your code for the third visualization
  svg
    .append("text")
    .attr("x", dimensions.width / 2)
    .attr("y", dimensions.height / 2)
    .text("Third Visualization")
    .style("text-anchor", "middle")
    .style("font-size", "24px");
}
const steps = d3.selectAll(".step");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const index = +entry.target.dataset.step;
      console.log("hey ", index);
      if (entry.isIntersecting) {
        steps.classed("active", false);
        d3.select(entry.target).classed("active", true);
        updateVisualization(index);
      }
    });
  },
  { threshold: 0.5 }
);

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
