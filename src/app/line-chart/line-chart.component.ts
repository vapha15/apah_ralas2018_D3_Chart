import { Component, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import d3Tip from 'd3-tip';
import * as $ from 'jquery';
declare var $: $


var margin = { left: 80, right: 100, top: 50, bottom: 100 },
  height = 500 - margin.top - margin.bottom,
  width = 800 - margin.left - margin.right;

var svg
var g
var parseTime
var formatTime
var bisectDate
var line
var xAxisCall
var yAxisCall
var xAxis
var yAxis
var x
var xLabel
var yLabel
var y
var t
var filteredData
var dataTimeFiltered

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit {

  constructor() { }
  ngOnInit() {


    parseTime = d3.timeParse("%d/%m/%Y");
    parseTime = d3.timeParse("%d/%m/%Y");
    formatTime = d3.timeFormat("%d/%m/%Y");
    bisectDate = d3.bisector(function (d: any) { return d.date; }).left;

    svg = d3.select("#line-chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)

    g = svg.append("g")
      .attr("transform", "translate(" + margin.left +
        ", " + margin.top + ")");

   t = function () { return d3.transition().duration(1000); }

    // Scales
    x = d3.scaleTime().range([0, width]);
    y = d3.scaleLinear().range([height, 0]);

    xAxisCall = d3.axisBottom(x)
      .ticks(4);


    xAxis = g.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")");

    yAxisCall = d3.axisLeft(y)
    yAxis = g.append("g")
      .attr("class", "y axis");



    console.log($("#line-chart").length)


    // Update our line path

    // Add the line for the first time
    g.append("path")
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", "grey")
      .attr("stroke-width", "3px");

    xLabel = g.append("text")
      .attr("class", "x axisLabel")
      .attr("y", height + 50)
      .attr("x", width / 2)
      .attr("font-size", "20px")
      .attr("text-anchor", "middle")
      .text("Time");

    yLabel = g.append("text")
      .attr("class", "y axisLabel")
      .attr("transform", "rotate(-90)")
      .attr("y", -60)
      .attr("x", -170)
      .attr("font-size", "20px")
      .attr("text-anchor", "middle")
      .text("Price (USD)")

  }

  ngAfterContentInit() {

    d3.json("assets/coins.json").then(function (data) {
      console.log(data);

      slider()
   
      // Prepare and clean data
      filteredData = {};
      for (var coin in data) {
        if (!data.hasOwnProperty(coin)) {
          continue;
        }
        filteredData[coin] = data[coin].filter(function (d) {
          return !(d["price_usd"] == null)
        })
        filteredData[coin].forEach(function (d) {
          d["price_usd"] = +d["price_usd"];
          d["24h_vol"] = +d["24h_vol"];
          d["market_cap"] = +d["market_cap"];
          d["date"] = parseTime(d["date"])
        });
      }

      // Run the visualization for the first time
      update();
    })

      //d3.json("http://localhost:3000/api/market").then(function (data: any[]) {
      .catch(function (error) {
        console.log(error)
      })
  }
}

function update() {
  // Filter data based on selections
  var coin = $("#coin-select").val(),
      yValue = $("#var-select").val(),
      sliderValues = $("#date-slider").slider("values");
  var dataTimeFiltered = filteredData[coin].filter(function(d){
      return ((d.date >= sliderValues[0]) && (d.date <= sliderValues[1]))
  });

   // Update scales
   x.domain(d3.extent(dataTimeFiltered, function(d: any){ return d.date; }));
   y.domain([d3.min(dataTimeFiltered, function(d){ return d[yValue]; }), 
       d3.max(dataTimeFiltered, function(d){ return d[yValue]; })]);
    
  // Fix for format values
  var formatSi = d3.format(".2s");
  function formatAbbreviation(x) {
    var s = formatSi(x);
    switch (s[s.length - 1]) {
      case "G": return s.slice(0, -1) + "B";
      case "k": return s.slice(0, -1) + "K";
    }
    return s;
  }

  // Update axes
  xAxisCall.scale(x);
  xAxis.transition(t()).call(xAxisCall);
  yAxisCall.scale(y);
  yAxis.transition(t()).call(yAxisCall.tickFormat(formatAbbreviation));

  // Clear old tooltips
  d3.select(".focus").remove();
  d3.select(".overlay").remove();

  // Tooltip code
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
      .attr("r", 5);
  focus.append("text")
      .attr("x", 15)
      .attr("dy", ".31em");
  svg.append("rect")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .attr("class", "overlay")
      .attr("width", width)
      .attr("height", height)
      .attr("opacity", 0)
      .on("mouseover", function() { focus.style("display", null); })
      .on("mouseout", function() { focus.style("display", "none"); })
      .on("mousemove", mousemove);
      
  function mousemove() {
      var x0 = x.invert(d3.mouse(this)[0]),
          i = bisectDate(dataTimeFiltered, x0, 1),
          d0 = dataTimeFiltered[i - 1],
          d1 = dataTimeFiltered[i],
          d = (d1 && d0) ? (x0 - d0.date > d1.date - x0 ? d1 : d0) : 0;
      focus.attr("transform", "translate(" + x(d.date) + "," + y(d[yValue]) + ")");
      focus.select("text").text(function() { return d3.format("$,")(d[yValue].toFixed(2)); });
      focus.select(".x-hover-line").attr("y2", height - y(d[yValue]));
      focus.select(".y-hover-line").attr("x2", -x(d.date));
  }

  // Path generator
  line = d3.line()
      .x(function(d: any){ return x(d.date); })
      .y(function(d){ return y(d[yValue]); });

  // Update our line path
  g.select(".line")
      .transition(t)
      .attr("d", line(dataTimeFiltered));

  // Update y-axis label
  var newText = (yValue == "price_usd") ? "Price (USD)" :
      ((yValue == "market_cap") ?  "Market Capitalization (USD)" : "24 Hour Trading Volume (USD)")
  yLabel.text(newText);

console.log("ddddd1111")
}

function slider() {
  // Add jQuery UI slider
  $("#date-slider").slider({
    range: true,
    max: parseTime("31/10/2017").getTime(),
    min: parseTime("12/5/2013").getTime(),
    step: 86400000, // One day
    values: [parseTime("12/5/2013").getTime(), parseTime("31/10/2017").getTime()],
    slide: function (event, ui) {
      $("#dateLabel1").text(formatTime(new Date(ui.values[0])));
      $("#dateLabel2").text(formatTime(new Date(ui.values[1])));
      update();
    }
  });
}


