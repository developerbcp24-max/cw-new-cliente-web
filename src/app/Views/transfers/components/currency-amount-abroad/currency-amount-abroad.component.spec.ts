import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyAmountAbroadComponent } from './currency-amount-abroad.component';

describe('CurrencyAmountAbroadComponent', () => {
  let component: CurrencyAmountAbroadComponent;
  let fixture: ComponentFixture<CurrencyAmountAbroadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrencyAmountAbroadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencyAmountAbroadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
