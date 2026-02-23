import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotaPaymentComponent } from './quota-payment.component';

describe('QuotaPaymentComponent', () => {
  let component: QuotaPaymentComponent;
  let fixture: ComponentFixture<QuotaPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotaPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotaPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
