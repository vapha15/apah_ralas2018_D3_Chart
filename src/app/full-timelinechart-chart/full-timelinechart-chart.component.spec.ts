import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FullTimelinechartChartComponent } from './full-timelinechart-chart.component';

describe('FullTimelinechartChartComponent', () => {
  let component: FullTimelinechartChartComponent;
  let fixture: ComponentFixture<FullTimelinechartChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FullTimelinechartChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullTimelinechartChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
