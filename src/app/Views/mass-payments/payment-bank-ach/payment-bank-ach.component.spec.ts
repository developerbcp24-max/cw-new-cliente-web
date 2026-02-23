import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentBankAchComponent } from './payment-bank-ach.component';

describe('PaymentBankAchComponent', () => {
  let component: PaymentBankAchComponent;
  let fixture: ComponentFixture<PaymentBankAchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentBankAchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentBankAchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
