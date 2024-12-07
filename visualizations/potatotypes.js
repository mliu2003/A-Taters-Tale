function drawPotatoTypes(svg, dimensions) {
    const { width, height } = dimensions;
    d3.csv("data/potatotypes.csv").then((rawData) => {
        var map = new Map();
        console.log(rawData[0]["Variety"])
        for (let i; i < rawData.length; i++) {
            console.log("here")
            var curr_variety = rawData[i]["Variety"]
            var curr_val = rawData[i]["Number of Stores"]
            if (map.has(curr_variety)) {
                map.set(curr_variety, map.get(curr_variety) + curr_val)
            } else {
                map.set(curr_variety, curr_val)
            }
        }
        console.log(map)
        
    })
}