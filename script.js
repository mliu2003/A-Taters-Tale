const steps = d3.selectAll(".step");
const svg = d3.select("svg");
const width = svg.node().clientWidth;
const height = svg.node().clientHeight;

const dimensions = {
  width: width,
  height: height,
};

const updateVisualization = (stepIndex) => {
  console.log(`Step ${stepIndex} active`);
  svg.selectAll("*").remove();

  switch (stepIndex) {
    case 0:
      drawTitle();
      break;
    case 1:
      drawVegetablePrices(svg, dimensions);
      break;
    case 2:
      drawGreenhouseGasEmissions(svg, dimensions);
      break;
    case 3:
      break;
    case 4:
      break;
    default:
      break;
  }
};

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const index = +entry.target.dataset.step;
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

function drawTitle() {
  // svg
  //   .append("text")
  //   .attr("x", width / 2)
  //   .attr("y", height / 2)
  //   .text("A TATER'S TALE")
  //   .style("text-anchor", "middle")
  //   .style("font-size", "24px");

  svg
    .append("image")
    .attr("x", 0)
    .attr("y", -100)
    .attr("height", "1000px")
    .attr("width", "800px")
    .attr("href", "images/title.jpg")
}

// ********* data preprocessors *********//

// "Entity" attr has been reassigned to "name". Code field is also omitted as it is empty. Year and time has also been omitted as it is always 2010
function greenhouseGasDataPreprocessor(row) {
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
