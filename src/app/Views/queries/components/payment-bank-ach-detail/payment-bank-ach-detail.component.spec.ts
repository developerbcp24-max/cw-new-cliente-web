import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentBankAchDetailComponent } from './payment-bank-ach-detail.component';

describe('PaymentBankAchDetailComponent', () => {
  let component: PaymentBankAchDetailComponent;
  let fixture: ComponentFixture<PaymentBankAchDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentBankAchDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentBankAchDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
