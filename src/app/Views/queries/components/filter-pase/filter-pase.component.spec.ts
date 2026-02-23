import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterPaseComponent } from './filter-pase.component';

describe('FilterPaseComponent', () => {
  let component: FilterPaseComponent;
  let fixture: ComponentFixture<FilterPaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterPaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterPaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
