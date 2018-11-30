import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FullBarchartChartComponent } from './full-barchart-chart.component';

describe('FullBarchartChartComponent', () => {
  let component: FullBarchartChartComponent;
  let fixture: ComponentFixture<FullBarchartChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FullBarchartChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullBarchartChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
