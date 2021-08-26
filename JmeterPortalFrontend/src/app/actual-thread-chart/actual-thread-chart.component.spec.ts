import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualThreadChartComponent } from './actual-thread-chart.component';

describe('ActualThreadChartComponent', () => {
  let component: ActualThreadChartComponent;
  let fixture: ComponentFixture<ActualThreadChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActualThreadChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActualThreadChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
