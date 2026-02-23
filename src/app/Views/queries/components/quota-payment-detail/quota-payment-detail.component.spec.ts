import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotaPaymentDetailComponent } from './quota-payment-detail.component';

describe('QuotaPaymentDetailComponent', () => {
  let component: QuotaPaymentDetailComponent;
  let fixture: ComponentFixture<QuotaPaymentDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotaPaymentDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotaPaymentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
