import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketOtherCurrencyComponent } from './ticket-other-currency.component';

describe('TicketOtherCurrencyComponent', () => {
  let component: TicketOtherCurrencyComponent;
  let fixture: ComponentFixture<TicketOtherCurrencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketOtherCurrencyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketOtherCurrencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
