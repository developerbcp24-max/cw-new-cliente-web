import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepecratedBeneficiaryFormAbroadComponent } from './depecrated-beneficiary-form-abroad.component';

describe('DepecratedBeneficiaryFormAbroadComponent', () => {
  let component: DepecratedBeneficiaryFormAbroadComponent;
  let fixture: ComponentFixture<DepecratedBeneficiaryFormAbroadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepecratedBeneficiaryFormAbroadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepecratedBeneficiaryFormAbroadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
