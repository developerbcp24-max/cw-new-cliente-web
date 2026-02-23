import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoliSpreadsheetComponent } from './soli-spreadsheet.component';

describe('SoliSpreadsheetComponent', () => {
  let component: SoliSpreadsheetComponent;
  let fixture: ComponentFixture<SoliSpreadsheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoliSpreadsheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SoliSpreadsheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
