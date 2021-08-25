import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualResponseChartComponent } from './actual-response-chart.component';

describe('ActualResponseChartComponent', () => {
  let component: ActualResponseChartComponent;
  let fixture: ComponentFixture<ActualResponseChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActualResponseChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActualResponseChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
