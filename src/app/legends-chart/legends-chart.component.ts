import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import d3Tip from 'd3-tip';

var margin = { left:80, right:20, top:50, bottom:100 };
var height = 500 - margin.top - margin.bottom, 
    width = 800 - margin.left - margin.right;

var g = d3.select("#legends-chart")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + 
            ", " + margin.top + ")");

var time = 0;

//tool tip

var tip = d3Tip().attr('class', 'd3-tip')
    .html(function(d){
        var text = "<strong>Country:</strong> <span style='color:red'>" + d.country + "</span><br>";
        text += "<strong>Continent:</strong> <span style='color:red;text-transform:capitalize'>" + d.continent + "</span><br>";
        text += "<strong>Life Expectancy:</strong> <span style='color:red'>" + d3.format(".2f")(d.life_exp) + "</span><br>";
        text += "<strong>GDP Per Capita:</strong> <span style='color:red'>" + d3.format("$,.0f")(d.income) + "</span><br>";
        text += "<strong>Population:</strong> <span style='color:red'>" + d3.format(",.0f")(d.population) + "</span><br>";
        return text;
    })

g.call(tip)    

// Scales
var x = d3.scaleLog()
    .base(10)
    .range([0, width])
    .domain([142, 150000]);
var y = d3.scaleLinear()
    .range([height, 0])
    .domain([0, 90]);
var area = d3.scaleLinear()
    .range([25*Math.PI, 1500*Math.PI])
    .domain([2000, 1400000000]);
var continentColor = d3.scaleOrdinal(d3.schemePastel1);

// Labels
var xLabel = g.append("text")
    .attr("y", height + 50)
    .attr("x", width / 2)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("GDP Per Capita ($)");
var yLabel = g.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -40)
    .attr("x", -170)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Life Expectancy (Years)")
var timeLabel = g.append("text")
    .attr("y", height -10)
    .attr("x", width - 40)
    .attr("font-size", "40px")
    .attr("opacity", "0.4")
    .attr("text-anchor", "middle")
    .text("1800");

// X Axis
var xAxisCall = d3.axisBottom(x)
    .tickValues([400, 4000, 40000])
    .tickFormat(d3.format("$"));
g.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height +")")
    .call(xAxisCall);

// Y Axis
var yAxisCall = d3.axisLeft(y)
    .tickFormat(function(d){ return "" +d; });
g.append("g")
    .attr("class", "y axis")
    .call(yAxisCall);

var continents = ["europe", "asia", "americas", "africa"];

var legend = g.append("g")
    .attr("transform", "translate(" + (width - 10) + 
        "," + (height - 125) + ")");

continents.forEach(function(continent, i){
    var legendRow = legend.append("g")
        .attr("transform", "translate(0, " + (i * 20) + ")");

    legendRow.append("rect")
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", continentColor(continent));

    legendRow.append("text")
        .attr("x", -10)
        .attr("y", 10)
        .attr("text-anchor", "end")
        .style("text-transform", "capitalize")
        .text(continent);
});


@Component({
  selector: 'app-legends-chart',
  templateUrl: './legends-chart.component.html',
  styleUrls: ['./legends-chart.component.css']
})
export class LegendsChartComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  ngAfterContentInit() {
    d3.json("assets/legends.json").then(function(data: any[]){
      console.log(data);
  
      // Clean data
      const formattedData = data.map(function(year){
          return year["countries"].filter(function(country){
              var dataExists = (country.income && country.life_exp);
              return dataExists
          }).map(function(country){
              country.income = +country.income;
              country.life_exp = +country.life_exp;
              return country;            
          })
      });
  
      // Run the code every 0.1 second
      d3.interval(function(){
          // At the end of our data, loop back
          time = (time < 214) ? time+1 : 0
          update(formattedData[time]);            
      }, 100);
  
      // First run of the visualization
      update(formattedData[0]);
  
  }).catch(function (error) {
    console.log(error)
  })

  }
}

function update(data: any[]) {
    // Standard transition time for the visualization
    var t = d3.transition()
        .duration(100);

    // JOIN new data with old elements.
    var circles = g.selectAll<SVGCircleElement, any>("circle" as any)
    .data(data, function (d) {
      return d.country
    })

    // EXIT old elements not present in new data.
    circles.exit()
        .attr("class", "exit")
        .remove();

    // ENTER new elements present in new data.
    circles.enter()
        .append("circle")
        .attr("class", "enter")
        .attr("fill", function(d) { return continentColor(d.continent); })
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide)
        .merge(circles)
        .transition(t)
            .attr("cy", function(d){ return y(d.life_exp); })
            .attr("cx", function(d){ return x(d.income) })
            .attr("r", function(d){ return Math.sqrt(area(d.population) / Math.PI) });

    // Update the time label
    timeLabel.text(+(time + 1800))
}