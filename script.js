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
      d3.select(".radio-buttons").remove();
      break;
    case 3: // PPA vs VPA
      removeTruckOrAll(svg, dimensions);
      drawPotatoValueEfficiency(svg, dimensions);
      break;
    case 4: // Truck
      d3.select(".radio-buttons").remove();
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
      drawOverview(svg, dimensions);
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

/**
 * Preprocesses raw data on potato dish popularity
 *
 * {
 *   dish: string,       // The name of the potato dish
 *   popularity: number  // The popularity of the dish in percentage of votes
 * }
 *
 * @param {object} row - A single row of data from the CSV file.
 * @returns {object} - A processed data object with the structure described above.
 */
function potatoPopularityDataPreprocessor(row) {
  return {
    dish: row["Dish"],
    popularity: +row["Popularity"],
  };
}

/**
 * Preprocesses raw potato data on yield, price, area, and seeding
 *
 * {
 *   state: string,        // State data is from
 *   yield: number,        // Potato yield in cwt per acre
 *   price: number,        // Price of potatoes in dollars per cwt
 *   area: number,         // Total area of potato cultivation in acres
 *   seeding: number,      // Total used for seeding in cwt
 *   yieldValue: number,   // Monetary value of the yield in dollars per acre
 *   plantingCost: number  // Cost of planting potatoes in dollars per acre
 * }
 *
 * @param {object} row - A single row of data from the CSV file.
 * @returns {object} - A processed data object with the structure described above.
 */
function potatoValueDataPreprocessor(row) {
  return {
    state: row["State"],
    yield: +row["Yield(cwt/acre)"],
    price: +row["Price(dollar/cwt)"],
    area: +row["Area(acre)"],
    seeding: +row["Seeding(cwt)"],
    yieldValue: +row["YieldValue(dollar/acre)"],
    plantingCost: +row["PlantingCost(dollar/acre)"],
  };
}
