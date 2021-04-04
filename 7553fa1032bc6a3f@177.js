// https://observablehq.com/@blevitin/trees-of-champaign-in-progress@177
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
   .attr("viewBox", [0,0,20,20])
   .style("border", "solid 1px black");
  const xScale = d3.scaleLinear().domain(d3.extent(trees, d=> d.X)).range([0,20]); //ranges need to be in arrays
  const yScale = d3.scaleLinear().domain(d3.extent(trees, d=> d.Y)).range([20,0]);
   svg.append("g")
    .attr("id", "trees")
    .selectAll("circle")
    .data(trees)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d.X))
    .attr("cy", d => yScale(d.Y))
    .attr("r", 0.02);
  return {svg: svg, xScale: xScale, yScale: yScale};
}
)});
  main.variable(observer()).define(["html"], function(html){return(
html`<style>.selected { fill:red; }</style>`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`<div id="panel1"></div><div id="panel2"></div>`
)});
  main.variable(observer()).define(["makeTrees","d3","trees"], function*(makeTrees,d3,trees)
{
  const {svg, xScale, yScale} = makeTrees();
  const firstPanel = d3.select("#panel1").text("Use your scroll wheel to zoom in on the map.");
  const secondPanel = d3.select("#panel2");
  const colorScale = d3.scaleOrdinal().domain(d3.group(trees, d => d.COND)).range(d3.schemeCategory10);
  yield svg.node();
  const quadTree = d3
    .quadtree()
    .x( d => xScale(d.X)) //get x points
    .y(d=> yScale(d.Y)) //get y points
    .addAll(trees);
  svg.on("mousemove", (e,d) => {
    var node = quadTree.find(e.offsetX, e.offsetY);
    secondPanel.text("The tree you have selected is on " + `${node.STREET}` + ". Its species is " + `${node.SPP}` + " and its common name is " + `${node.COMMON}` + ".");
    });
  const brush = d3.brush().extent([[0, 0], [20, 20]]).handleSize(0.1);
  function brushCalled(event) {
    svg.selectAll("circles")
      .data(d3.group(trees, d => d.COND))
      .attr("id", d => ""+d[0])
      .filter( d => xScale(d.X) > event.selection[0][0]
                && xScale(d.X) < event.selection[1][0]
                && yScale(d.Y) > event.selection[0][1]
                && yScale(d.Y) < event.selection[1][1] )
      .transition()
      .style("fill", d => colorScale(d[0]));
  };
  svg.append("g")
    .attr("class", "mybrush")
    .style("stroke-width", 0.01)
    .call(brush.on("brush", brushCalled));  
}
);
  return main;
}
