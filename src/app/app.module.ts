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

@NgModule({
  declarations: [
    AppComponent,
    BuildingsChartComponent,
    RevenueChartComponent,
    LegendsChartComponent,
    LineChartComponent,
    GeomapChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [BuildingsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
