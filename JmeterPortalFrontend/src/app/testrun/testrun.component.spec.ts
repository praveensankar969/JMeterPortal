import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestrunComponent } from './testrun.component';

describe('TestrunComponent', () => {
  let component: TestrunComponent;
  let fixture: ComponentFixture<TestrunComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestrunComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestrunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
