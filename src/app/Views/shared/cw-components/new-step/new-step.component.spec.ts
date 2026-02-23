import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewStepComponent } from './new-step.component';

describe('NewStepComponent', () => {
  let component: NewStepComponent;
  let fixture: ComponentFixture<NewStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
