import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LegendsChartComponent } from './legends-chart.component';

describe('LegendsChartComponent', () => {
  let component: LegendsChartComponent;
  let fixture: ComponentFixture<LegendsChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LegendsChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LegendsChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
