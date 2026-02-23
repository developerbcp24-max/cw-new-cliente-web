import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositOtherBankCheckSpreadsheetComponent } from './deposit-other-bank-check-spreadsheet.component';

describe('DepositOtherBankCheckSpreadsheetComponent', () => {
  let component: DepositOtherBankCheckSpreadsheetComponent;
  let fixture: ComponentFixture<DepositOtherBankCheckSpreadsheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepositOtherBankCheckSpreadsheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositOtherBankCheckSpreadsheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
