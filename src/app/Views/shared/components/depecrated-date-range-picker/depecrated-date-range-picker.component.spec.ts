import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepecratedDateRangePickerComponent } from './depecrated-date-range-picker.component';

describe('DepecratedDateRangePickerComponent', () => {
  let component: DepecratedDateRangePickerComponent;
  let fixture: ComponentFixture<DepecratedDateRangePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepecratedDateRangePickerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepecratedDateRangePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
