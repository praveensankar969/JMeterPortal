import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AverageResponseChartComponent } from './average-response-chart.component';

describe('AverageResponseChartComponent', () => {
  let component: AverageResponseChartComponent;
  let fixture: ComponentFixture<AverageResponseChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AverageResponseChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AverageResponseChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
