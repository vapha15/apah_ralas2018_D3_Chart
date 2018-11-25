import { Component, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import d3Tip from 'd3-tip';
import * as $ from 'jquery';


var margin = { left: 80, right: 100, top: 50, bottom: 100 },
  height = 500 - margin.top - margin.bottom,
  width = 800 - margin.left - margin.right;

var svg
var g
var parseTime
var bisectDate
var line
var xAxisCall
var yAxisCall
var xAxis
var yAxis
var x
var y
@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit {

  constructor() { }
  ngOnInit() {

    // Time parser for x-scale
    parseTime = d3.timeParse("%Y");
    // For tooltip
    bisectDate = d3.bisector(function (d: any) { return d.year; }).left;

    // Scales
    x = d3.scaleTime().range([0, width]);
    y = d3.scaleLinear().range([height, 0]);

    // Axis generators
    xAxisCall = d3.axisBottom(x)
    yAxisCall = d3.axisLeft(y)
      .ticks(6)
      .tickFormat(function (d: any) { 
        console.log(typeof(d))

        console.log((d / 1000)+"k")

     return (d / 1000) + "k"; });

    console.log($("#line-chart").length)

    svg = d3.select("#line-chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    g = svg.append("g")
      .attr("transform", "translate(" + margin.left +
        ", " + margin.top + ")");

    // Line path generator
    line = d3.line()
      .x(function (d: any) { return x(d.year); })
      .y(function (d: any) { return y(d.value); });

    parseTime = d3.timeParse("%Y");

    bisectDate = d3.bisector(function (d: any) { return d.year; }).left;

    // Scales
    x = d3.scaleTime().range([0, width]);
    y = d3.scaleLinear().range([height, 0]);

    // Axis groups
    xAxis = g.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")");
    yAxis = g.append("g")
      .attr("class", "y axis")

    // Y-Axis label
    yAxis.append("text")
      .attr("class", "axis-title")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .attr("fill", "#5D6971")
      .text("Population)");

    // Line path generator
    line = d3.line()
      .x(function (d: any) { return x(d.year); })
      .y(function (d: any) { return y(d.value); });
  }

  ngAfterContentInit() {

    //d3.json("http://localhost:3000/api/market").then(function (data: any[]) {
    d3.json("assets/example.json").then(function (data: any[]) {

      console.log(data)
      // Data cleaning
      data.forEach(function (d) {
        d.year = parseTime(d.year);
        d.value = +d.value;
      });

      // Set scale domains
      x.domain(d3.extent(data, function (d) { return d.year; }));
      y.domain([d3.min(data, function (d) { return d.value; }) / 1.005,
      d3.max(data, function (d) { return d.value; }) * 1.005]);

      // Generate axes once scales have been set
      xAxis.call(xAxisCall.scale(x))
      yAxis.call(yAxisCall.scale(y))

      // Add line to chart
      g.append("path")
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", "grey")
        .attr("stroke-with", "3px")
        .attr("d", line(data));

      /******************************** Tooltip Code ********************************/

      var focus = g.append("g")
      .attr("class", "focus")
      .style("display", "none");

  focus.append("line")
      .attr("class", "x-hover-line hover-line")
      .attr("y1", 0)
      .attr("y2", height);

  focus.append("line")
      .attr("class", "y-hover-line hover-line")
      .attr("x1", 0)
      .attr("x2", width);

  focus.append("circle")
      .attr("r", 7.5);

  focus.append("text")
      .attr("x", 15)
      .attr("dy", ".31em");

  g.append("rect")
      .attr("class", "overlay")
      .attr("width", width)
      .attr("height", height)
      .attr("opacity",0)
      .on("mouseover", function() { focus.style("display", null); })
      .on("mouseout", function() { focus.style("display", "none"); })
      .on("mousemove", mousemove);

  function mousemove() {
      var x0 = x.invert(d3.mouse(this)[0]),
          i = bisectDate(data, x0, 1),
          d0 = data[i - 1],
          d1 = data[i],
          d = x0 - d0.year > d1.year - x0 ? d1 : d0;
      focus.attr("transform", "translate(" + x(d.year) + "," + y(d.value) + ")");
      focus.select("text").text(d.value);
      focus.select(".x-hover-line").attr("y2", height - y(d.value));
      focus.select(".y-hover-line").attr("x2", -x(d.year));
  }
      /******************************** Tooltip Code ********************************/

    }).catch(function (error) {
      console.log(error)
    })
  }
}


