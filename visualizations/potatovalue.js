function drawPotatoValueEfficiency(svg, dimensions) {
  d3.csv("data/potatovalueefficiency.csv").then((rawData) => {
    const potatoData = rawData.map((row) => potatoValueDataPreprocessor(row));
    console.log(potatoData);
  });
}
