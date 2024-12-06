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

  switch (stepIndex) {
    case 0: // Title
      svg.selectAll("*").remove();
      drawTitle();
      break;
    case 1: // Greenhouse Gases
      svg.selectAll("*").remove();
      drawGreenhouseGasEmissions(svg, dimensions);
      break;
    case 2: // Potato Type
      svg.selectAll("*").remove();
      break;
    case 3: // PPA vs VPA
      removeTruckOrAll(svg, dimensions);
      drawVegetablePrices(svg, dimensions);
      break;
    case 4: // Truck
      drawTruck(svg, dimensions);
      break;
    case 5: // Production by State
      removeTruckOrAll(svg, dimensions);
      break;
    case 6: // Price by Crop
      svg.selectAll("*").remove();
      drawVegetablePrices(svg, dimensions);
      break;
    case 7: // Potato Dishes
      svg.selectAll("*").remove();
      break;
    case 8: // How to eat?
      svg.selectAll("*").remove();
      drawPotatoDishChoices(svg, dimensions);
      break;
    case 9: // Chips
      svg.selectAll("*").remove();
      drawChips(svg, dimensions);
      break;
    case 10: // Nutrition Facts
      svg.selectAll("*").remove();
      break;
    case 11: // Goodbye
      svg.selectAll("*").remove();
      break;
    default:
      svg.selectAll("*").remove();
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
  svg
    .append("image")
    .attr("x", 0)
    .attr("y", -100)
    .attr("height", "1000px")
    .attr("width", "800px")
    .attr("href", "images/title.jpg");
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

function potatoPopularityDataPreprocessor(row) {
  return {
    dish: row["Dish"],
    popularity: +row["Popularity"],
  };
}
