import { ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, ViewChild, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import { ThrowStmt } from '@angular/compiler';
import { svg } from 'd3';

@Component({
    selector: 'app-buildings-chart',
    templateUrl: './buildings-chart.component.html',
    styleUrls: ['./buildings-chart.component.css']
})

export class BuildingsChartComponent implements OnInit {
    @ViewChild('chart')
    chartElement: ElementRef;




    constructor() {


    }

    ngOnInit() {

    }


    ngAfterContentInit() {

        var margin = { left: 100, right: 10, top: 10, bottom: 150 };

        var width = 600 - margin.left - margin.right;
        var height = 400 - margin.top - margin.bottom;
        
        //d3.json("http://localhost:3000/api/market").then(function (data: any[]) {
         d3.json("assets/data.json").then(function (data: any[]) {
            console.log(data);

            data.forEach(function (d) {
                //converting string number to integer
                d.height = +d.height;
            });
            var svg = d3.select("#chart-area-buildings")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);

            var g = svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            var x = d3.scaleBand()
                .domain(data.map(function (d) { return d.name; }))
                .range([0, width])
                .paddingInner(0.3)
                .paddingOuter(0.3);

            var y = d3.scaleLinear()
                .domain([0, d3.max(data, function (d) {
                    return d.height;
                })])
                .range([height, 0])

            // X Label
            g.append("text")
                .attr("class", "x axis-label")
                .attr("x", width / 2)
                .attr("y", height + 140)
                .attr("font-size", "20px")
                .attr("text-anchor", "middle")
                .text("The word's tallest buildings");

            // Y Label
            g.append("text")
                .attr("class", "y axis-label")
                .attr("x", - (height / 2))
                .attr("y", -60)
                .attr("font-size", "20px")
                .attr("text-anchor", "middle")
                .attr("transform", "rotate(-90)")
                .text("Height (m)");

            var xAxisCall = d3.axisBottom(x);
            g.append("g")
                .attr("class", "x-axis")
                .attr("transform", "translate(0, " + height + ")")
                .call(xAxisCall)
                .selectAll("text")
                .attr("y", "10")
                .attr("x", "-5")
                .attr("text-anchor", "end")
                .attr("transform", "rotate(-40)")

            var yAxisCall = d3.axisLeft(y)
                .ticks(3)
                .tickFormat(function(d){
                    return d + "m";
                })

            g.append("g")
                .attr("class", "y-axis")
                .call(yAxisCall)

            var rects = g.selectAll("rect")
                .data(data)
                .enter()
                .append("rect")
                .attr("y", function(d){
                    return y(d.height)
                })
                .attr("x", function (d, i) {
                    return x(d.name);
                })
                .attr("width", x.bandwidth)
                .attr("height", function (d) {
                    return height -  y(d.height);
                })
                .attr("fill", function (d) {
                    return "grey";
                });



        }).catch(function (error) {
            console.log(error)
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

    clicked2(event: any) {
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
                    return "yellow";
                });

        })
    }

}
