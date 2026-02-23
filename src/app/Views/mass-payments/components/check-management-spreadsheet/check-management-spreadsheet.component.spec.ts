import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckManagementSpreadsheetComponent } from './check-management-spreadsheet.component';

describe('CheckManagementSpreadsheetComponent', () => {
  let component: CheckManagementSpreadsheetComponent;
  let fixture: ComponentFixture<CheckManagementSpreadsheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckManagementSpreadsheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckManagementSpreadsheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
