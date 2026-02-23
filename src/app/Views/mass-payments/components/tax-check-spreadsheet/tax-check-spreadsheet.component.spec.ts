import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxCheckSpreadsheetComponent } from './tax-check-spreadsheet.component';

describe('TaxCheckSpreadsheetComponent', () => {
  let component: TaxCheckSpreadsheetComponent;
  let fixture: ComponentFixture<TaxCheckSpreadsheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxCheckSpreadsheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxCheckSpreadsheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
