import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyAndAmountComponent } from './currency-and-amount.component';

describe('CurrencyAndAmountComponent', () => {
  let component: CurrencyAndAmountComponent;
  let fixture: ComponentFixture<CurrencyAndAmountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrencyAndAmountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencyAndAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
