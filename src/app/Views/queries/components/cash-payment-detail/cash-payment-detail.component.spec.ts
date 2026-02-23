import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashPaymentDetailComponent } from './cash-payment-detail.component';

describe('CashPaymentDetailComponent', () => {
  let component: CashPaymentDetailComponent;
  let fixture: ComponentFixture<CashPaymentDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashPaymentDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CashPaymentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
