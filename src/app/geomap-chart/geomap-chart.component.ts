import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as $ from 'jquery';
declare var $: $
import * as topology from 'topojson';
import { Feature, Geometry } from 'geojson';
import *as top from 'geojson';
import * as topology2  from 'topojson-specification';

var margin = { left: 80, right: 20, top: 50, bottom: 100 };
var height = 500 - margin.top - margin.bottom,
    width = 800 - margin.left - margin.right;

////////
var svg
var unemployment
var promises
var path
var x
var g
var color
@Component({
    selector: 'app-geomap-chart',
    templateUrl: './geomap-chart.component.html',
    styleUrls: ['./geomap-chart.component.css']
})
export class GeomapChartComponent implements OnInit {

    constructor() {
    }

    ngOnInit() {

        svg = d3.select("svg"),
            width = +svg.attr("width"),
            height = +svg.attr("height");

        unemployment = d3.map();

        path = d3.geoPath();

        x = d3.scaleLinear()
            .domain([1, 10])
            .rangeRound([600, 860]);

        color = d3.scaleThreshold()
            .domain(d3.range(2, 10))
            .range(d3.schemeBlues["9"]);

        g = svg.append("g")
            .attr("class", "key")
            .attr("transform", "translate(0,40)");

        g.selectAll("rect")
            .data(color.range().map(function (d) {
                d = color.invertExtent(d);
                if (d[0] == null) d[0] = x.domain()[0];
                if (d[1] == null) d[1] = x.domain()[1];
                return d;
            }))
            .enter().append("rect")
            .attr("height", 8)
            .attr("x", function (d) { return x(d[0]); })
            .attr("width", function (d) { return x(d[1]) - x(d[0]); })
            .attr("fill", function (d) { return color(d[0]); });

        g.append("text")
            .attr("class", "caption")
            .attr("x", x.range()[0])
            .attr("y", -6)
            .attr("fill", "#000")
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .text("Unemployment rate");

        g.call(d3.axisBottom(x)
            .tickSize(13)
            .tickFormat(function (x){ return  x + "%"; })
            .tickValues(color.domain()))
            .select(".domain")
            .remove();
    }
    ngAfterContentInit() {

        promises = [
            d3.json("https://d3js.org/us-10m.v1.json"),
            d3.tsv("assets/map.tsv").then(function (d: any[]) {

                d.forEach(element => {
                    unemployment.set(element.id, element.rate);
                });
            })
        ]

        Promise.all(promises).then(function (data: any) {

            ready(data[0]);
        }).catch(function (error) {
            console.log(error);
        });

    }

    ngAfterContentChecked() {

    }

    ngAfterViewInit() {

    }

    ngAfterViewChecked() {

    }
}

function ready(us: any) {
//Topology<Objects<{ [name: string]: any; }>>'.
    var casted = us as Feature<Geometry>
    svg.append("g")
        .attr("class", "counties")
        .selectAll("path")
        .data(
            topology.feature(us, casted["objects"].counties).features)
        .enter().append("path")
        .attr("fill", function (d) {
            return color(d.rate = unemployment.get(d.id));
        })
        .attr("d", path)
        .append("title")
        .text(function (d) { return d.rate + "%"; });

    svg.append("path")
        .datum(topology.mesh(us, us.objects.states, function (a, b) { return a !== b; }))
        .attr("class", "states").attr("opacity", 0)
        .attr("d", path);
}
