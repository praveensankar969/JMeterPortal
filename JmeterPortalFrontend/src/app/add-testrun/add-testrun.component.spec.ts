import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTestrunComponent } from './add-testrun.component';

describe('AddTestrunComponent', () => {
  let component: AddTestrunComponent;
  let fixture: ComponentFixture<AddTestrunComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTestrunComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTestrunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
