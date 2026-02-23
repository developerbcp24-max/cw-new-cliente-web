import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyFlagComponent } from './currency-flag.component';

describe('CurrencyFlagComponent', () => {
  let component: CurrencyFlagComponent;
  let fixture: ComponentFixture<CurrencyFlagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrencyFlagComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencyFlagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
