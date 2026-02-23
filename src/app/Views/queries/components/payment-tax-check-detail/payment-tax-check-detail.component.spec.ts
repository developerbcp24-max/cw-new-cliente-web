import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentTaxCheckDetailComponent } from './payment-tax-check-detail.component';

describe('PaymentTaxCheckDetailComponent', () => {
  let component: PaymentTaxCheckDetailComponent;
  let fixture: ComponentFixture<PaymentTaxCheckDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentTaxCheckDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentTaxCheckDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
