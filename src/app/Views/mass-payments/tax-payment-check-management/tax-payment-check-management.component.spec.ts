import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxPaymentCheckManagementComponent } from './tax-payment-check-management.component';

describe('TaxPaymentCheckManagementComponent', () => {
  let component: TaxPaymentCheckManagementComponent;
  let fixture: ComponentFixture<TaxPaymentCheckManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxPaymentCheckManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxPaymentCheckManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
