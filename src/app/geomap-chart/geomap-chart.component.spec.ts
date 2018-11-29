import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeomapChartComponent } from './geomap-chart.component';

describe('GeomapChartComponent', () => {
  let component: GeomapChartComponent;
  let fixture: ComponentFixture<GeomapChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeomapChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeomapChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
