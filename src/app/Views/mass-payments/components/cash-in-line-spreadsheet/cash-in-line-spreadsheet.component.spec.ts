import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashInLineSpreadsheetComponent } from './cash-in-line-spreadsheet.component';

describe('CashInLineSpreadsheetComponent', () => {
  let component: CashInLineSpreadsheetComponent;
  let fixture: ComponentFixture<CashInLineSpreadsheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashInLineSpreadsheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CashInLineSpreadsheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
