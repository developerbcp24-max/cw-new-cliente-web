import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepecratedEmailsInputComponent } from './depecrated-emails-input.component';

describe('DepecratedEmailsInputComponent', () => {
  let component: DepecratedEmailsInputComponent;
  let fixture: ComponentFixture<DepecratedEmailsInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepecratedEmailsInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepecratedEmailsInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
