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

function potatoPopularityDataPreprocessor(row) {
  return {
    dish: row["Dish"],
    popularity: +row["Popularity"],
  };
}

function PricePerYieldDataPreprocessor(row) {
  return {
    state: row["State"],
    area_planted_2021: row["AreaPlanted2021"],
    area_planted_2022: row["AreaPlanted2022"],
    area_planted_2023: row["AreaPlanted2023"],
    area_harvested_2021: row["AreaHarvested2021"],
    area_harvested_2022: row["AreaHarvested2022"],
    area_harvested_2023: row["AreaHarvested2023"],
    yield_2021: row["Yield2021"],
    yield_2022: row["Yield2022"],
    yield_2023: row["Yield2023"],
    production_2021: row["Production2021"],
    production_2022: row["Production2022"],
    production_2023: row["Production2023"],
    production_cwt_2021: row["ProductionCWT2021"],
    total_seed_2021: row["TotalSeed2021"],
    seed_feed_2021: row["SeedFeed2021"],
    shrink_loss_2021: row["ShrinkLoss2021"],
    sold_2021: row["Sold2021"],
    price_cwt_2022:row["PriceCWT2022"],
    production_value_2022: row["ProductionValue2022"],
    sales_value_2022: row["SalesValue2022"],
    production_cwt_2022: row["ProductionCWT2022"],
    total_seed_2022: row["TotalSeed2022"],
    seed_feed_2022: row["SeedFeed2022"],
    shrink_loss_2021: row["ShrinkLoss2022"],
    sold_2022: row["Sold2022"],
    price_cwt_2023:row["PriceCWT2023"],
    production_value_2023: row["ProductionValue2023"],
    sales_value_2023: row["SalesValue2023"],
    production_cwt_2023: row["ProductionCWT2023"],
    total_seed_2023: row["TotalSeed2023"],
    seed_feed_2023: row["SeedFeed2023"],
    shrink_loss_2023: row["ShrinkLoss2023"],
    sold_2023: row["Sold2023"],
    price_cwt_2023:row["PriceCWT2023"],
    production_value_2023: row["ProductionValue2023"],
    sales_value_2023: row["SalesValue2023"]
  };
}
