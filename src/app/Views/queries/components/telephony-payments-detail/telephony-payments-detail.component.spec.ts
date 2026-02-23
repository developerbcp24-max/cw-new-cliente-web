import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelephonyPaymentsDetailComponent } from './telephony-payments-detail.component';

describe('TelephonyPaymentsDetailComponent', () => {
  let component: TelephonyPaymentsDetailComponent;
  let fixture: ComponentFixture<TelephonyPaymentsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TelephonyPaymentsDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TelephonyPaymentsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
