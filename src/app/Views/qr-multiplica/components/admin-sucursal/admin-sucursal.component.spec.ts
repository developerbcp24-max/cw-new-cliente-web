import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSucursalComponent } from './admin-sucursal.component';

describe('AdminSucursalComponent', () => {
  let component: AdminSucursalComponent;
  let fixture: ComponentFixture<AdminSucursalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminSucursalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSucursalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
