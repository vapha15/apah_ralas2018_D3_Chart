import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BuildingsChartComponent } from './buildings-chart/buildings-chart.component';
import { RevenueChartComponent } from './revenue-chart/revenue-chart.component';
import { LegendsChartComponent } from './legends-chart/legends-chart.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import {HttpClientModule} from '@angular/common/http';
import { BuildingsService } from './buildings-chart/buildings.service';
import { GeomapChartComponent } from './geomap-chart/geomap-chart.component';
import { FullChartComponent } from './full-chart/full-chart.component';
import { FullBarchartChartComponent } from './full-barchart-chart/full-barchart-chart.component';
import { FullDonutschartChartComponent } from './full-donutschart-chart/full-donutschart-chart.component';
import { FullStackedareachartChartComponent } from './full-stackedareachart-chart/full-stackedareachart-chart.component';
import { FullTimelinechartChartComponent } from './full-timelinechart-chart/full-timelinechart-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    BuildingsChartComponent,
    RevenueChartComponent,
    LegendsChartComponent,
    LineChartComponent,
    GeomapChartComponent,
    FullChartComponent,
    FullBarchartChartComponent,
    FullDonutschartChartComponent,
    FullStackedareachartChartComponent,
    FullTimelinechartChartComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [BuildingsService, FullChartComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
