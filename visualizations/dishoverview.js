function drawOverview(svg, dimensions) {
  const { width, height } = dimensions;

  const radius = Math.min(width, height) / 3;

  // const test_data = [16, 15, 12, 11, 8, 8, 8, 7, 6, 5, 4];
  const data = {
    // value, name_rot_offset, name_inner_radius_offset, name_outer_radius_offset, value_rot_offset, value_inner_radius_offset, value_outer_radius_offset
    "French Fries": [16, 150, -10, 10, 100, 115, -250],
    "Mashed": [15, 150, 5, 10, 100, 100, -250],
    "Baked": [12, 100, 30, 10, 80, 140, -250],
    "Hash Browns": [11, 100, 40, 10, 75, 150, -250],
    "Tater Tots": [8, 100, 50, 10, 50, 150, -250],
    "Potato Salad": [8, 100, 50, 10, 50, -100, 10],
    "Potato Wedges": [8, 80, 65, 10, 60, -105, 10],
    "Twice Baked": [7, 50, 70, 10, 50, -100, 10],
    "Skins": [6, 50, 50, 10, 40, -100, 10],
    "Potato Soup": [5, 20, 50, 10, 30, -100, 10],
    "Other": [4, 35, 30, 10, 30, -100, 10]
  }

  const pastelColors = [
    "#FAD0C4",
    "#F8C8DC",
    "#D5A6BD",
    "#A8D0E6",
    "#C4E1C1",
    "#FFE156",
    "#FF9A8B",
    "#F4A300",
    "#B0E0E6",
    "#F0E5DE",
    "#F2E6AC"
  ];


  const pieData = Object.entries(data).map(([key, [value, _]]) => ({ name: key, value }));
  const data_dict = {}
  let pie = d3.pie().value(d => d.value);
  const temp_arcs = pie(pieData);

  for (var i = 0; i < temp_arcs.length; i++) {
    data_dict[temp_arcs[i].data.name] = [temp_arcs[i].startAngle, temp_arcs[i].startAngle];
  }

  pie = d3.pie()
    .value(d => d.value)
    .startAngle(0)
    .endAngle(0);

  const arc = d3.arc()
    .innerRadius(0)
    .outerRadius(radius);

  const centerX = width / 2;
  const centerY = height / 2;

  const arcs = svg.selectAll('.arc')
    .data(pie(pieData))
    .enter().append('g')
    .attr('class', 'arc')
    .attr('transform', `translate(${centerX}, ${centerY})`);

  const path = arcs.append('path')
    .attr('d', arc)
    .attr('fill', (d, i) => pastelColors[i])
    .attr('stroke', 'white')
    .attr('stroke-width', 1)
    .attr('stroke-linejoin', 'round')
    .each(function (d, i) {
      d.startAngle = data_dict[d.data.name][0];
      d.endAngle = data_dict[d.data.name][0];
    });

  arcs.append('text')
    .attr('transform', function (d) {
      const centroid = d3.arc()
      .innerRadius(radius + data[d.data.name][2])
      .outerRadius(radius + data[d.data.name][3]).centroid(d);

      const angle = (d.startAngle + d.endAngle) / 2;
      const offset = data[d.data.name][1];

      centroid[0] += Math.cos(angle) * offset;
      centroid[1] += Math.sin(angle) * offset;

      return `translate(${centroid})`;
    })
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .style('font-size', '12px')
    .attr("font-weight", 700)
    .style('font-family', 'Arima Madurai')
    .style('opacity', 0)
    .text(d => d.data.name)

  arcs.append('text')
    .attr('transform', function (d) {
      const centroid = d3.arc()
      .innerRadius(radius + data[d.data.name][5])
      .outerRadius(radius + data[d.data.name][6]).centroid(d);

      const angle = (d.startAngle + d.endAngle) / 2;
      const offset = data[d.data.name][4];

      centroid[0] += Math.cos(angle) * offset;
      centroid[1] += Math.sin(angle) * offset;

      return `translate(${centroid})`;
    })
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .style('font-size', '12px')
    .style('font-family', 'Arima Madurai')
    .style('opacity', 0)
    .text(d => d.data.value.toString() + "%")
    .transition()

  path.transition()
    .duration(100)
    .delay((d, i) => i * 85)
    .ease(d3.easeLinear)
    .attrTween('d', function (d) {
      const interpolate = d3.interpolate(d.endAngle, d.startAngle + (d.data.value / 100) * (2 * Math.PI));
      return function (t) {
        d.endAngle = interpolate(t);
        return arc(d);
      };
    })
    .on('end', function(d, i) {
      d3.select(this.parentNode)
        .selectAll('text')
        .transition()
        .duration(250)
        .style('opacity', 1);
    });
}