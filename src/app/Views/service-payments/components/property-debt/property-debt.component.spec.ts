import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyDebtComponent } from './property-debt.component';

describe('PropertyDebtComponent', () => {
  let component: PropertyDebtComponent;
  let fixture: ComponentFixture<PropertyDebtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyDebtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyDebtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
