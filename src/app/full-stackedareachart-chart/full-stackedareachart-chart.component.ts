import { Component, OnInit, Input } from '@angular/core';
import * as d3 from 'd3';
import * as $ from 'jquery';
import { FullChartComponent } from '../full-chart/full-chart.component';
import { NestedCall } from '../full-chart/full-chart.component';
declare var $: $
var parseTime
var formatTime
var vis
@Component({
  selector: 'app-full-stackedareachart-chart',
  templateUrl: './full-stackedareachart-chart.component.html',
  styleUrls: ['./full-stackedareachart-chart.component.css']
})
export class FullStackedareachartChartComponent implements OnInit {
  parentElement
  constructor(_parentElement: string) { 
    this.parentElement = _parentElement;
    parseTime = d3.timeParse("%d/%m/%Y");
    formatTime = d3.timeFormat("%d/%m/%Y");
    
    this.initVis();
  }

  ngOnInit() {
  
  }

  initVis = function(){
     vis = this;

    vis.margin = { left:80, right:100, top:50, bottom:40 };
    vis.height = 370 - vis.margin.top - vis.margin.bottom;
    vis.width = 800 - vis.margin.left - vis.margin.right;

    vis.svg = d3.select(vis.parentElement)
        .append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom);
    vis.g = vis.svg.append("g")
        .attr("transform", "translate(" + vis.margin.left + 
            ", " + vis.margin.top + ")");

    vis.t = () => { return d3.transition().duration(1000); }

    vis.color = d3.scaleOrdinal(d3.schemePastel1);

    vis.x = d3.scaleTime().range([0, vis.width]);
    vis.y = d3.scaleLinear().range([vis.height, 0]);

    vis.yAxisCall = d3.axisLeft(vis.y)
    vis.xAxisCall = d3.axisBottom(vis.x)
        .ticks(4);
    vis.xAxis = vis.g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + vis.height +")");
    vis.yAxis = vis.g.append("g")
        .attr("class", "y axis");

    vis.stack = d3.stack()
        .keys(["west", "south", "northeast", "midwest"]);

    vis.area = d3.area()
        .x(function(d:any) { return vis.x(parseTime(d.data.date)); })
        .y0(function(d) { return vis.y(d[0]); })
        .y1(function(d) { return vis.y(d[1]); });

    vis.addLegend();

    vis.wrangleData();
};

wrangleData = function(){

  vis.variable = $("#var-select").val()

  vis.dayNest = d3.nest()
      .key(function(d:any){ return formatTime(d.date); })
      .entries(NestedCall.prototype.callsArray)

  vis.dataFiltered = vis.dayNest
      .map(function(day){
          return day.values.reduce(function(accumulator, current){
              accumulator.date = day.key
              accumulator[current.team] = accumulator[current.team] + current[vis.variable]
              return accumulator;
          }, {
              "northeast": 0,
              "midwest": 0,
              "south": 0,
              "west": 0
          })
      })

  vis.updateVis();
};

updateVis = function(){
 
  vis.maxDateVal = d3.max(vis.dataFiltered, function(d){
      var vals = d3.keys(d).map(function(key){ return key !== 'date' ? d[key] : 0 });
      return d3.sum(vals);
  });

  // Update scales
  vis.x.domain(d3.extent(vis.dataFiltered, (d:any) => {  return parseTime(d.date); }));
  vis.y.domain([0, vis.maxDateVal]);

  // Update axes
  vis.xAxisCall.scale(vis.x);
  vis.xAxis.transition(vis.t()).call(vis.xAxisCall);
  vis.yAxisCall.scale(vis.y);
  vis.yAxis.transition(vis.t()).call(vis.yAxisCall);

  vis.teams = vis.g.selectAll(".team")
      .data(vis.stack(vis.dataFiltered));
  
  // Update the path for each team
  vis.teams.select(".area")
      .attr("d", vis.area)

  vis.teams.enter().append("g")
      .attr("class", function(d){ return "team " + d.key })
      .append("path")
          .attr("class", "area")
          .attr("d", vis.area)
          .style("fill", function(d){
              return vis.color(d.key)
          })
          .style("fill-opacity", 0.5)
};

addLegend = function(){
  
  var legend = vis.g.append("g")
      .attr("transform", "translate(" + (50) + 
                  ", " + (-25) + ")");

  var legendArray = [
      {label: "Northeast", color: vis.color("northeast")},
      {label: "West", color: vis.color("west")},
      {label: "South", color: vis.color("south")},
      {label: "Midwest", color: vis.color("midwest")}
  ]

  var legendCol = legend.selectAll(".legendCol")
      .data(legendArray)
      .enter().append("g")
          .attr("class", "legendCol")
          .attr("transform", (d, i) => {
              return "translate(" + (i * 150) + ", " + (0) + ")"
          });
      
  legendCol.append("rect")
      .attr("class", "legendRect")
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", d => { return d.color; })
      .attr("fill-opacity", 0.5);

  legendCol.append("text")
      .attr("class", "legendText")
      .attr("x", 20)
      .attr("y", 10)
      .attr("text-anchor", "start")
      .text(d => { return d.label; }); 
}

}
