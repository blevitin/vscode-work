var d3 = import('d3');
var csv_parse = import('csv-parse');

trees = csv_parse.csv("https://gis-cityofchampaign.opendata.arcgis.com/datasets/979bbeefffea408e8f1cb7a397196c64_22.csv?outSR=%7B%22latestWkid%22%3A3857%2C%22wkid%22%3A102100%7D");

function makeTrees() {
  const width = 450;
  const height = 450;
  const svg = create("svg")
   .attr("width", width)
   .attr("height", height)
   .attr("viewBox", [0,0,1,1])
   .style("border", "solid 1px black");
  const xScale = scaleLinear().domain(extent(trees, d=> d.X)).range([0,1]); //ranges need to be in arrays
  const yScale = scaleLinear().domain(extent(trees, d=> d.Y)).range([1,0]);
   svg.append("g")
    .attr("id", "trees")
    .selectAll("circle")
    .data(trees)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d.X))
    .attr("cy", d => yScale(d.Y))
    .attr("r", 0.001);
  return {svg: svg, xScale: xScale, yScale: yScale};
}

{
  const {svg, xScale, yScale} = makeTrees();
  const leftPanel = select("#panel1");
  const secondPanel = select("#panel2");
  var test = svg.node();
  leftPanel.append(test);
  const quadTree = quadtree()
    .x( d => xScale(d.X)) //get x points
    .y(d=> yScale(d.Y)) //get y points
    .addAll(trees);
  svg.on("mousemove", (e,d) => {
    var node = quadTree.find(e.offsetX, e.offsetY)
         secondPanel.text("this is a tree on " + `${node.STREET}`);
    });
}