import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvidersCheckManagementDetailComponent } from './providers-check-management-detail.component';

describe('ProvidersCheckManagementDetailComponent', () => {
  let component: ProvidersCheckManagementDetailComponent;
  let fixture: ComponentFixture<ProvidersCheckManagementDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProvidersCheckManagementDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvidersCheckManagementDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
