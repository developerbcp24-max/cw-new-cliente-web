import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentAchOddDetailComponent } from './payment-ach-odd-detail.component';

describe('PaymentAchOddDetailComponent', () => {
  let component: PaymentAchOddDetailComponent;
  let fixture: ComponentFixture<PaymentAchOddDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentAchOddDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentAchOddDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
