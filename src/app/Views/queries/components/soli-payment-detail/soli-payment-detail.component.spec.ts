import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoliPaymentDetailComponent } from './soli-payment-detail.component';

describe('SoliPaymentDetailComponent', () => {
  let component: SoliPaymentDetailComponent;
  let fixture: ComponentFixture<SoliPaymentDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoliPaymentDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SoliPaymentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
