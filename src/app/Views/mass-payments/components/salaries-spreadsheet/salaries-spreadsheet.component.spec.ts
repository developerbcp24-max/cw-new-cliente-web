import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalariesSpreadsheetComponent } from './salaries-spreadsheet.component';

describe('SalariesSpreadsheetComponent', () => {
  let component: SalariesSpreadsheetComponent;
  let fixture: ComponentFixture<SalariesSpreadsheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalariesSpreadsheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalariesSpreadsheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
