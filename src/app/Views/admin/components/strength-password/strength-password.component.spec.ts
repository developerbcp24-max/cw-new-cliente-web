import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrengthPasswordComponent } from './strength-password.component';

describe('StrengthPasswordComponent', () => {
  let component: StrengthPasswordComponent;
  let fixture: ComponentFixture<StrengthPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StrengthPasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StrengthPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
