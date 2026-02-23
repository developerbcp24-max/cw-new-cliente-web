import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashPaymentInLineDetailComponent } from './cash-payment-in-line-detail.component';

describe('CashPaymentInLineDetailComponent', () => {
  let component: CashPaymentInLineDetailComponent;
  let fixture: ComponentFixture<CashPaymentInLineDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashPaymentInLineDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CashPaymentInLineDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
