import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashSpreadsheetComponent } from './cash-spreadsheet.component';

describe('CashSpreadsheetComponent', () => {
  let component: CashSpreadsheetComponent;
  let fixture: ComponentFixture<CashSpreadsheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashSpreadsheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CashSpreadsheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
