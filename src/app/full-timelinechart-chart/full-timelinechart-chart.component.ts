import { Component, OnInit, Input } from '@angular/core';
import * as d3 from 'd3';
import * as $ from 'jquery';
import { FullChartComponent } from '../full-chart/full-chart.component';
import { NestedCall } from '../full-chart/full-chart.component';
declare var $: $
declare var $: $
var parseTime
var formatTime
var vis

@Component({
  selector: 'app-full-timelinechart-chart',
  templateUrl: './full-timelinechart-chart.component.html',
  styleUrls: ['./full-timelinechart-chart.component.css']
})
export class FullTimelinechartChartComponent implements OnInit  {

  parentElement
  constructor(_parentElement: string) {
    parseTime = d3.timeParse("%d/%m/%Y");
    formatTime = d3.timeFormat("%d/%m/%Y");
    this.parentElement = _parentElement;
  
    this.initVis();

  }

  ngOnInit() {
  }

  initVis = function () {
    vis = this;

    vis.margin = {top: 0, right: 100, bottom: 20, left: 80};
    vis.width = 800 - vis.margin.left - vis.margin.right;
    vis.height = 100 - vis.margin.top - vis.margin.bottom;

    vis.svg = d3.select(vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)

    vis.t = () => { return d3.transition().duration(1000); }

    vis.g = vis.svg.append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.x = d3.scaleTime()
        .range([0, vis.width]);

    vis.y = d3.scaleLinear()
        .range([vis.height, 0]);

    vis.xAxisCall = d3.axisBottom(vis.x)
        .ticks(4);

    vis.xAxis = vis.g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + vis.height +")");

    vis.areaPath = vis.g.append("path")
        .attr("fill", "#ccc");

    // Initialize brush component
    vis.brush = d3.brushX()
        .handleSize(10)
        .extent([[0, 0], [vis.width, vis.height]])
        .on("brush end", NestedCall.prototype.brushedFunction)

    // Append brush component
    vis.brushComponent = vis.g.append("g")
        .attr("class", "brush")
        .call(vis.brush);

    vis.wrangleData();
   

  };


  wrangleData = function () {

    vis.variable = "call_revenue"

    vis.dayNest = d3.nest()
        .key(function(d:any){ return formatTime(d.date); })
        .entries(NestedCall.prototype.callsArray)

    vis.dataFiltered = vis.dayNest
        .map(function(day){
            return {
                date: day.key,
                sum: day.values.reduce(function(accumulator, current){
                    return accumulator + current[vis.variable]
                }, 0)               
            }

        })

    vis.updateVis();

  };


  updateVis = function () {
    var vis = this
    vis.x.domain(d3.extent(vis.dataFiltered, (d:any) => { return parseTime(d.date); }));
    vis.y.domain([0, d3.max(vis.dataFiltered, (d:any) => d.sum) ])

    vis.xAxisCall.scale(vis.x)

    vis.xAxis.transition(vis.t()).call(vis.xAxisCall)

    vis.area0 = d3.area()
        .x((d:any) => { return vis.x(parseTime(d.date)); })
        .y0(vis.height)
        .y1(vis.height);

    vis.area = d3.area()
        .x((d:any) => { return vis.x(parseTime(d.date)); })
        .y0(vis.height)
        .y1((d:any) => { return vis.y(d.sum); })

    vis.areaPath
        .data([vis.dataFiltered])
        .attr("d", vis.area);
  console.log("")
    }
  


}



