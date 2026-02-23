import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrPaymentAchBatchDetailComponent } from './qr-payment-ach-batch-detail.component';

describe('QrPaymentAchBatchDetailComponent', () => {
  let component: QrPaymentAchBatchDetailComponent;
  let fixture: ComponentFixture<QrPaymentAchBatchDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QrPaymentAchBatchDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QrPaymentAchBatchDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
