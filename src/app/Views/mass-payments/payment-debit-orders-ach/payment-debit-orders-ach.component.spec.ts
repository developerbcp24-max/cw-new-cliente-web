import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentDebitOrdersAchComponent } from './payment-debit-orders-ach.component';

describe('PaymentDebitOrdersAchComponent', () => {
  let component: PaymentDebitOrdersAchComponent;
  let fixture: ComponentFixture<PaymentDebitOrdersAchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentDebitOrdersAchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentDebitOrdersAchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
