import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepecratedCurrencyFlagComponent } from './depecrated-currency-flag.component';

describe('DepecratedCurrencyFlagComponent', () => {
  let component: DepecratedCurrencyFlagComponent;
  let fixture: ComponentFixture<DepecratedCurrencyFlagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepecratedCurrencyFlagComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepecratedCurrencyFlagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
