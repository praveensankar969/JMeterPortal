import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestimePercentileChartComponent } from './restime-percentile-chart.component';

describe('RestimePercentileChartComponent', () => {
  let component: RestimePercentileChartComponent;
  let fixture: ComponentFixture<RestimePercentileChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RestimePercentileChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RestimePercentileChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
