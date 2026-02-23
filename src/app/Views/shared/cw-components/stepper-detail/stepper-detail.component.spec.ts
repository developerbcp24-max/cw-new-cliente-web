import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepperDetailComponent } from './stepper-detail.component';

describe('StepperDetailComponent', () => {
  let component: StepperDetailComponent;
  let fixture: ComponentFixture<StepperDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StepperDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StepperDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
