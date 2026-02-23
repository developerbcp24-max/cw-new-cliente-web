import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicePaymentBatchDetailComponent } from './service-payment-batch-detail.component';

describe('ServicePaymentBatchDetailComponent', () => {
  let component: ServicePaymentBatchDetailComponent;
  let fixture: ComponentFixture<ServicePaymentBatchDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicePaymentBatchDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicePaymentBatchDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
