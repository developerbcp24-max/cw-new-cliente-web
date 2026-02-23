import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvidersCheckManagementLipComponent } from './providers-check-management-lip.component';

describe('ProvidersCheckManagementLipComponent', () => {
  let component: ProvidersCheckManagementLipComponent;
  let fixture: ComponentFixture<ProvidersCheckManagementLipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProvidersCheckManagementLipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvidersCheckManagementLipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
