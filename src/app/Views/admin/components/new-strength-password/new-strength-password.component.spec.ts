import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewStrengthPasswordComponent } from './new-strength-password.component';

describe('NewStrengthPasswordComponent', () => {
  let component: NewStrengthPasswordComponent;
  let fixture: ComponentFixture<NewStrengthPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewStrengthPasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewStrengthPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
