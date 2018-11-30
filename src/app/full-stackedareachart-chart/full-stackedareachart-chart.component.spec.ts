import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FullStackedareachartChartComponent } from './full-stackedareachart-chart.component';

describe('FullStackedareachartChartComponent', () => {
  let component: FullStackedareachartChartComponent;
  let fixture: ComponentFixture<FullStackedareachartChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FullStackedareachartChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullStackedareachartChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
