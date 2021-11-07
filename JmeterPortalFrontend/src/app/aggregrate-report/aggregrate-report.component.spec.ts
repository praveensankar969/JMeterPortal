import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AggregrateReportComponent } from './aggregrate-report.component';

describe('AggregrateReportComponent', () => {
  let component: AggregrateReportComponent;
  let fixture: ComponentFixture<AggregrateReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AggregrateReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AggregrateReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
