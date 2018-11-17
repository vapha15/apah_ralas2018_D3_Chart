import { Component } from '@angular/core';
import * as d3 from 'd3';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Titel: my-dream-app';

  ngAfterContentInit() {
    d3.select('p').style('color', 'blue');

    d3.json("assets/buildings.json").then(function (data: any[]) {
      console.log(data);

      data.forEach(function (d) {
        d.height = +d.height;
      });
      var svg = d3.select("#chart-area")
        .append("svg")
        .attr("width", "500")
        .attr("height", "500");

      var rects = svg.selectAll("rect")
        .data(data)
        .enter().append("rect")
        .attr("y", 0)
        .attr("x", function (d, i) {
          return (i * 60);
        })
        .attr("width", 40)
        .attr("height", function (d) {
          return d.height;
        })
        .attr("fill", function (d) {
          return "grey";
        });

    })
  }
  clicked(event: any) {
    d3.select(event.target)
      .append('circle')
      .attr('cx', event.x)
      .attr('cy', event.y)
      .attr('r', 10)
      .attr('fill', 'green')
    console.log("Green")
  }
}
