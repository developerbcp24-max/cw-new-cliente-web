import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AchSpreadsheetComponent } from './ach-spreadsheet.component';

describe('AchSpreadsheetComponent', () => {
  let component: AchSpreadsheetComponent;
  let fixture: ComponentFixture<AchSpreadsheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AchSpreadsheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AchSpreadsheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
