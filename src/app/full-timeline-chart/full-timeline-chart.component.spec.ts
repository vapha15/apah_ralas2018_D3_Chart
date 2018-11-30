import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FullTimelineChartComponent } from './full-timeline-chart.component';

describe('FullTimelineChartComponent', () => {
  let component: FullTimelineChartComponent;
  let fixture: ComponentFixture<FullTimelineChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FullTimelineChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullTimelineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
