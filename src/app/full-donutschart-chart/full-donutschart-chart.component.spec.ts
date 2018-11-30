import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FullDonutschartChartComponent } from './full-donutschart-chart.component';

describe('FullDonutschartChartComponent', () => {
  let component: FullDonutschartChartComponent;
  let fixture: ComponentFixture<FullDonutschartChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FullDonutschartChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullDonutschartChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
