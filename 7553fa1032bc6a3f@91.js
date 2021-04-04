// https://observablehq.com/@blevitin/trees-of-champaign-in-progress@91
export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# Trees of Champaign - in progress`
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@6")
)});
  main.variable(observer("trees")).define("trees", ["d3"], function(d3){return(
d3.csv("https://gis-cityofchampaign.opendata.arcgis.com/datasets/979bbeefffea408e8f1cb7a397196c64_22.csv?outSR=%7B%22latestWkid%22%3A3857%2C%22wkid%22%3A102100%7D", d3.autoType)
)});
  main.variable(observer("makeTrees")).define("makeTrees", ["d3","trees"], function(d3,trees){return(
function makeTrees() {
  const width = 450;
  const height = 450;
  const svg = d3
   .create("svg")
   .attr("width", width)
   .attr("height", height)
   .attr("viewBox", [0,0,1,1])
   .style("border", "solid 1px black");
  const xScale = d3.scaleLinear().domain(d3.extent(trees, d=> d.X)).range([0,1]); //ranges need to be in arrays
  const yScale = d3.scaleLinear().domain(d3.extent(trees, d=> d.Y)).range([1,0]);
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
)});
  main.variable(observer()).define(["md"], function(md){return(
md`<div id="panel1">testing</div><div id="panel2">also test</div>`
)});
  main.variable(observer()).define(["makeTrees","d3","trees"], function*(makeTrees,d3,trees)
{
  const {svg, xScale, yScale} = makeTrees();
  const leftPanel = d3.select("#panel1");
  const secondPanel = d3.select("#panel2");
  yield svg.node();
  const quadTree = d3
    .quadtree()
    .x( d => xScale(d.X)) //get x points
    .y(d=> yScale(d.Y)) //get y points
    .addAll(trees);
  svg.on("mousemove", (e,d) => {
    var node = quadTree.find(e.offsetX, e.offsetY)
         secondPanel.text("this is a tree on " + `${node.STREET}`);
    });
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`</div><div id="myTestDiv"></div>`
)});
  main.variable(observer()).define(["makeTrees","d3","trees"], function*(makeTrees,d3,trees)
{
  const {svg, xScale, yScale} = makeTrees();
  yield svg.node();
  const textPanel = d3.select("#myTestDiv");
  const quadtree = d3
  .quadtree()
  .x( d => xScale(d.X)) //get x points
  .y(d=> yScale(d.Y)) //get y points
  .addAll(trees); //do it for all the elements in here
  svg.on("mouseover", (e,d) => {
     quadtree.visit((node, x0,y0,x1,y1) => {
     textPanel.text("this is a test at x:" + `${d.ADDRESS}`);
  });
  });
}
);
  return main;
}
