import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvidersCheckManagementComponent } from './providers-check-management.component';

describe('ProvidersCheckManagementComponent', () => {
  let component: ProvidersCheckManagementComponent;
  let fixture: ComponentFixture<ProvidersCheckManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProvidersCheckManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvidersCheckManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
