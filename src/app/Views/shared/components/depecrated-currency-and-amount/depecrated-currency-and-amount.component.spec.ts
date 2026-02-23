import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepecratedCurrencyAndAmountComponent } from './depecrated-currency-and-amount.component';

describe('DepecratedCurrencyAndAmountComponent', () => {
  let component: DepecratedCurrencyAndAmountComponent;
  let fixture: ComponentFixture<DepecratedCurrencyAndAmountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepecratedCurrencyAndAmountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepecratedCurrencyAndAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
