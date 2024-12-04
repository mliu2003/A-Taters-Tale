const steps = d3.selectAll(".step");
const svg = d3.select("svg");
const width = svg.node().clientWidth;
const height = svg.node().clientHeight;

const dimensions = {
  width: width,
  height: height,
};

let currIndex = 0;
const spuddyText = [
  {
    title: "Welcome to A Tater's Tale",
    desc: "This is the zeroth step of the story. (scroll here)",
    spuddyImg: "",
  },
  {
    title: "This is the first step of the story.",
    desc: "",
    spuddyImg: "images/spuddy-money.png",
  },
  {
    title:
      "Greenhouse gas emissions per kilogram produced of popular produce items.",
    desc: "Potatoes produce about 0.46 kilogram of greenhouse gases per kilogram of potato produced, making it one of the lowest producers of greenhouse gases (relative to other food products).",
    spuddyImg: "images/spuddy-sun.png",
  },
  {
    title: "How to eat??",
    desc: "Americans love to eat potatoes! Although potatoes can be enjoyed in many ways, the most common are french fries, mashed potatoes, and baked potatoes. Click on the images to learn more about each dish! Spuddy's favorite is french fries!",
    spuddyImg: "images/spuddy-sun.png",
  },
  {
    title:
      "Chips are among the most popular ways potatoes are enjoyed by consumers.",
    desc: "Based on sales (millions of USD), potato chip lovers around the world predominantly enjoy Lay's, followed by Ruffles, Pringles, and other more niche brands.",
    spuddyImg: "",
  },
];

d3.selectAll("div.step")
  .append("img")
  .attr("src", "./images/spuddy-sun.png")
  .attr("alt", "Click for more info!")
  .style("width", "100px")
  .style("height", "auto")
  .on("click", () => {
    console.log("click!");
    console.log(currIndex);
    console.log(spuddyText[0].title);
  });
d3.selectAll("div.step").each(() => {
    console.log("pog", this);
})

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
      drawPotatoDishChoices(svg, dimensions);
      break;
    case 4:
      drawChips(svg, dimensions);
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
        currIndex = index;
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
