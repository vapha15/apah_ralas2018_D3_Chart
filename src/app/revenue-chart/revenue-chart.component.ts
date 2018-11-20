import { ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, ViewChild, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import { ThrowStmt } from '@angular/compiler';
import { svg } from 'd3';


var _flag = true;

var _transition = d3.transition().duration(990);

var margin = { left: 80, right: 20, top: 50, bottom: 100 };
var width = 600 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;

var g = d3.select("#rower")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

// X Label
var xLabel = 
g.append("text")
  .attr("y", height + 50)
  .attr("x", width / 2)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("Month");

// Y Label
var yLabel = 
 g.append("text")
  .attr("y", -60)
  .attr("x", -(height / 2))
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")
  .text("Revenue");
writer("Update method called")

// X Scale
var x = d3.scaleBand()
  .range([0, width])
  .padding(0.2);

// Y Scale
var y = d3.scaleLinear()
  .range([height, 0]);

var xAxisGroup = g.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")

var yAxisGroup = g.append("g")
  .attr("class", "y axis")

@Component({
  selector: 'app-revenue-chart',
  templateUrl: './revenue-chart.component.html',
  styleUrls: ['./revenue-chart.component.css']
})


export class RevenueChartComponent implements OnInit {

  constructor() { }

    ngOnInit() {
  }

  ngAfterContentInit() {

    //d3.json("http://localhost:3000/api/market").then(function (data: any[]) {
    d3.json("assets/revenue.json").then(function (data: any[]) {
   
      console.log(data);
      // Clean data
      data.forEach(function (d) {
        d.revenue = +d.revenue;
        d.profit = +d.profit;
        
      });
  
      d3.interval(function () {
        var newData = _flag ? data : data.slice(1);  
        updateBartChart(newData)
        _flag = !_flag
      }, 1000);


    }).catch(function (error) {
      console.log(error)
    })
  }
}

//UPDATES FUNCTION
function writer(data) {
  console.log(data + "Writer Test ")
}

function updateBartChart(data: any[]) {
  var flagValue = _flag? "revenue" : "profit"; 

  x.domain(data.map(function (d) { return d.month }))
  y.domain([0, d3.max(data, function (d) { return d[flagValue] })])
  // X Axis
  var xAxisCall = d3.axisBottom(x);
  xAxisGroup.transition(_transition).call(xAxisCall);

  // Y Axis
  var yAxisCall = d3.axisLeft(y)
    .tickFormat(function (d) { return "$" + d; });
  yAxisGroup.transition(_transition).call(yAxisCall);
  
  // Bars
  //JOIN new data with old elements
  var rects = g.selectAll<SVGRectElement, any>("rect" as any)
    .data(data, function(d){
      return d.month
    })

  //EXIT old elements not present in new data
  rects.exit()
  .attr("fill", "red")
  .transition(_transition)
  .attr("y", y(0))
  .attr("height", 0)
  .remove()

  //UPDATE old elements present in new data
  rects.transition(_transition)
    .attr("y", function (d) { return y(d[flagValue]); })
    .attr("x", function (d) { return x(d.month) })
    .attr("height", function (d) { return height - y(d[flagValue]); })
    .attr("width", x.bandwidth)

  //ENTER new elements present in new data
  rects.enter()
    .append("rect")
    .attr("fill", "orange")
    .attr("y", y(0))
    .attr("height", 0)
    .attr("x", function (d) { return x(d.month) })
    .attr("width", x.bandwidth)
    .merge(rects)
    .transition(_transition)
    .attr("x", function (d) { return x(d.month) })
    .attr("width", x.bandwidth)
    .attr("y", function (d) { return y(d[flagValue]); })
    .attr("height", function (d) { return height - y(d[flagValue]); })

    // .attr("y", y(0))
    // .attr("fill-opacity", 0)
    // .transition(d3.transition().duration(500))
    //   .attr("y", function(d){
    //     return y(d[value]);})
    //     .attr("fill-opacity", 1);
   
  
    var label = _flag ? "Revenue" : "Profit";
    yLabel.text(label);
}

