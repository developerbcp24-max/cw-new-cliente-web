import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterTypeTransfersComponent } from './filter-type-transfers.component';

describe('FilterTypeTransfersComponent', () => {
  let component: FilterTypeTransfersComponent;
  let fixture: ComponentFixture<FilterTypeTransfersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterTypeTransfersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterTypeTransfersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
