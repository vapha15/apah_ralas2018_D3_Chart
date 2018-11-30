import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FullChartComponent } from './full-chart.component';

describe('FullChartComponent', () => {
  let component: FullChartComponent;
  let fixture: ComponentFixture<FullChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FullChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
