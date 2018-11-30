import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

import * as $ from 'jquery';
declare var $: $
import * as topology from 'topojson';
import { Feature, Geometry } from 'geojson';
import *as top from 'geojson';
import * as topology2 from 'topojson-specification';
import { FullBarchartChartComponent } from '../full-barchart-chart/full-barchart-chart.component';
import { FullDonutschartChartComponent } from '../full-donutschart-chart/full-donutschart-chart.component';
import { FullStackedareachartChartComponent } from '../full-stackedareachart-chart/full-stackedareachart-chart.component'
import { FullTimelinechartChartComponent } from '../full-timelinechart-chart/full-timelinechart-chart.component'

var parseTime
var formatTime
var allCalls
var calls
var nestedCalls
var donut
var revenueBar
var durationBar
var unitBar
var stackedArea
var timeline

@Component({
  selector: 'app-full-chart',
  templateUrl: './full-chart.component.html',
  styleUrls: ['./full-chart.component.css']
})
export class FullChartComponent implements OnInit {
  nestedCalls = []
  constructor() {
  }

  ngOnInit() {

    parseTime = d3.timeParse("%d/%m/%Y");
    formatTime = d3.timeFormat("%d/%m/%Y");
  }
  ngAfterContentInit() {

    d3.json("assets/calls.json").then(function (data: any) {

      console.log(data)
      data.map(function (d) {
        d.call_revenue = +d.call_revenue
        d.units_sold = +d.units_sold
        d.call_duration = +d.call_duration
        d.date = parseTime(d.date)
        return d
      })

      allCalls = data;
      calls = data;

      nestedCalls = d3.nest()
        .key(function (d: any) {
          return d.category;
        })
        .entries(calls)

      donut = new FullDonutschartChartComponent("#company-size")

      revenueBar = new FullBarchartChartComponent("#revenue", "call_revenue", "Average call revenue (USD)")
      durationBar = new FullBarchartChartComponent("#call-duration", "call_duration", "Average call duration (seconds)")
      unitBar = new FullBarchartChartComponent("#units-sold", "units_sold", "Units sold per call")

      stackedArea = new FullStackedareachartChartComponent("#stacked-area")

      timeline = new FullTimelinechartChartComponent("#timeline")

      $("#var-select").on("change", function () {

        unitBar.wrangleData();
        stackedArea.wrangleData();
      })
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

function brushed() {

  var selection = d3.event.selection || timeline.x.range();
  var newValues = selection.map(timeline.x.invert)
  changeDates(newValues)
}

function changeDates(values) {
  calls = allCalls.filter(function (d) {
    return ((d.date > values[0]) && (d.date < values[1]))
  })

  nestedCalls = d3.nest()
    .key(function (d: any) {
      return d.category;
    })
    .entries(calls)

  $("#dateLabel1").text(formatTime(values[0]))
  $("#dateLabel2").text(formatTime(values[1]))

  donut.wrangleData();
  revenueBar.wrangleData();
  unitBar.wrangleData();
  durationBar.wrangleData();
  stackedArea.wrangleData();
}

export class NestedCall {

  get nestedCallsArray() {
    return nestedCalls;
  }

  get callsArray() {
    return calls;
  }

  get brushedFunction() {
    return brushed;
  }

}