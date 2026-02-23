import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashPaymentsInLineComponent } from './cash-payments-in-line.component';

describe('CashPaymentsInLineComponent', () => {
  let component: CashPaymentsInLineComponent;
  let fixture: ComponentFixture<CashPaymentsInLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashPaymentsInLineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CashPaymentsInLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
