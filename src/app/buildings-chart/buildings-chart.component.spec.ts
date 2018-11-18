import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildingsChartComponent } from './buildings-chart.component';

describe('BuildingsChartComponent', () => {
  let component: BuildingsChartComponent;
  let fixture: ComponentFixture<BuildingsChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuildingsChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildingsChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
