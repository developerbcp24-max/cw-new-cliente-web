import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AchOddSpreadsheetComponent } from './ach-odd-spreadsheet.component';

describe('AchOddSpreadsheetComponent', () => {
  let component: AchOddSpreadsheetComponent;
  let fixture: ComponentFixture<AchOddSpreadsheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AchOddSpreadsheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AchOddSpreadsheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
