import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AverageThreadChartComponent } from './average-thread-chart.component';

describe('AverageThreadChartComponent', () => {
  let component: AverageThreadChartComponent;
  let fixture: ComponentFixture<AverageThreadChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AverageThreadChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AverageThreadChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
