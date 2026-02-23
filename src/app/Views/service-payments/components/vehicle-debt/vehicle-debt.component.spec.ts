import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleDebtComponent } from './vehicle-debt.component';

describe('VehicleDebtComponent', () => {
  let component: VehicleDebtComponent;
  let fixture: ComponentFixture<VehicleDebtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleDebtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleDebtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
