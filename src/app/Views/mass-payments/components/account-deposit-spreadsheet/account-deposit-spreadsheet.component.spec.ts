import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountDepositSpreadsheetComponent } from './account-deposit-spreadsheet.component';

describe('AccountDepositSpreadsheetComponent', () => {
  let component: AccountDepositSpreadsheetComponent;
  let fixture: ComponentFixture<AccountDepositSpreadsheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountDepositSpreadsheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountDepositSpreadsheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
