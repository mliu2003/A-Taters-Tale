const steps = d3.selectAll(".step");
const svg = d3.select("svg");
const graphic = d3.select(".graphic");
const width = svg.node().clientWidth;
const height = svg.node().clientHeight;

const spuddyText = [
  "Hi there! My name is Spuddy! I'll be your personal potato buddy today! Try scrolling to see some visualizations, and be sure to click on me for more info!",
  "Hover over each vegetable name to see the how many kilograms of greenhouse gases (GHG) are produced per kilogram of crop produced.",
  "The total amount of land used to plant potatoes in the United States in 2023 is about 131,000 acres.",
  "You're able to click and drag both the map above me and the scatter plot to see which points align with which state on the map. You can also hover over each point in the scatterplot to see the planting cost and yield value.",
  "We potatoes love riding trucks! It's like a road trip! Click on the different sections of the truck to learn some fun facts about potato transportation as well as the Big Idaho Potato Truck!",
  "Did you know? Idaho is better than your bum state (at least in terms of potato production). Hover over each state to find out the exact amount of potatoes produced in each state.",
  "Toggle the radio buttons at the top to see how many pounds of each vegetable you're able to buy for the given amount!",
  "Looks like a pie chart of a well blaanced meal to me!",
  'Click on the images to learn more about each dish! My favorite are french fries!',
  "slide 9",
  "slide 10",
  "Thanks for watching! Spuddy out.",
];

const dimensions = {
  width: width,
  height: height,
};

const clear = () => {
  svg.selectAll("*").remove();
  d3.select(".radio-buttons").remove();
  d3.selectAll(".overlay").remove();
};

const clearTitleOrAll = () => {
  d3.select(".radio-buttons").remove();
  const title = svg.select(".title");
  const { width, height } = dimensions;
  graphic.style("background-color", "khaki");
  d3.select(".radio-buttons").remove();
  if (title.empty()) {
    svg.selectAll("*").remove();
  } else {
    title
      .transition()
      .duration(1000)
      .ease(d3.easeCubicInOut)
      .attr("transform", `translate(0, ${-height})`)
      .remove();
  }
};

let clickedSpuddy = false;

const updateSpuddy = (stepIndex) => {
  d3.selectAll(".spuddy").remove();
  const spuddyContainer = d3.select(".spuddyContainer");
  const spuddy = spuddyContainer.append("div").attr("class", "spuddy");
  spuddy
    .style("position", "absolute")
    .style("bottom", "0px")
    .style("display", "flex")
    .style("flex-direction", "column")
    .style("z-index", 1);
  if (stepIndex == 0 && !clickedSpuddy) {
    spuddy
      .append("img")
      .attr("class", "clickme")
      .attr("src", "images/clickme.png")
      .attr("width", "200px");
  }

  const spuddyRow = spuddy.append("div").style("display", "flex");

  const spuddyClick = spuddyRow
    .append("img")
    .attr("class", "spuddyclick")
    .attr("src", "images/spuddyclick.png")
    .attr("width", "200px");

  const textBox = spuddyRow
    .append("div")
    .style("background-color", "white")
    .style("border", "1px solid black")
    .style("border-radius", "20px")
    .style("box-shadow", "0px 4px 6px rgba(0, 0, 0, 0.1)")
    .style("opacity", 0);

  textBox
    .append("p")
    .text(spuddyText[stepIndex])
    .style("margin", "0")
    .style("padding", "10px")
    .style("color", "black");

  spuddyClick.style("cursor", "pointer").on("click", function () {
    textBox.style("opacity", textBox.style("opacity") == 1 ? 0 : 1);
    if (!clickedSpuddy) {
      clickedSpuddy = true;
      d3.selectAll(".clickme").remove();
    }
  });
};

const updateVisualization = (stepIndex) => {
  updateSpuddy(stepIndex);
  switch (stepIndex) {
    case 0: // Title
      clear();
      drawTitle();
      break;
    case 1: // Greenhouse Gases
      clearTitleOrAll();
      clear();
      drawGreenhouseGasEmissions(svg, dimensions);
      break;
    case 2: // Potato Type
      clear();
      drawPotatoTypes(svg, dimensions);
      break;
    case 3: //VPA vs PPA
      clear();
      d3.select("#map-container").selectAll("*").remove();
      removeTruckOrAll(svg, dimensions);
      drawPotatoValueEfficiency(svg, dimensions);
      break;
    case 4: // Truck
      drawTruck(svg, dimensions);
      break;
    case 5: // Production by State
      removeTruckOrAll(svg, dimensions);
      clear();
      drawPotatoProduction(svg, dimensions);
      break;
    case 6: // Price by Crop
      clear();
      drawVegetablePrices(svg, dimensions);
      break;
    case 7: // Potato Dishes
      clear();
      drawOverview(svg, dimensions);
      break;
    case 8: // How to eat?
      clear();
      drawPotatoDishChoices(svg, dimensions);
      break;
    case 9: // Chips
      clear();
      drawChips(svg, dimensions);
      break;
    case 10: // Nutrition Facts
      clear();
      drawNutrition(svg, dimensions);
      break;
    case 11: // Goodbye
      clear();
      drawOutro(svg, dimensions);
      break;
    default:
      clear();
      break;
  }

  d3.selectAll(".progBarImg").remove();

  const progBar = d3.select(".progressbar");

  for (let i = 0; i < 12; i++) {
    const img = progBar
      .append("img")
      .attr("class", "progBarImg")
      .attr("src", "images/spuddy-sun.png")
      .attr("width", 30)
      .attr("height", 30)
      .style("opacity", 0.3);
    if (stepIndex == i) {
      img.style("opacity", 1).style("background-color", "rgb(140, 82, 45)");
    }
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
  graphic.style("background-color", "rgb(140, 82, 45)");

  svg
    .append("image")
    .attr("class", "title")
    .attr("x", 0)
    .attr("y", -100)
    .attr("height", height)
    .attr("width", width)
    .attr("href", "images/title.png");
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
 * Preprocesses raw data on potato production (by state)
 *
 * {
 *   state: string,       // The name of the state (ruh roh)
 *   production: number  // Total production of potatoes (1000 cwt)
 * }
 *
 * @param {object} row - A single row of data from the CSV file.
 * @returns {object} - A processed data object with the structure described above.
 */
function potatoProductionDataPreprocessor(row) {
  return {
    state: row["State"],
    production: +row["Production"],
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

function potatoTypesPreprocessor(row) {
  return {
    name: row["Variety"],
    value: Number(row["AcresPlanted"]),
  };
}
