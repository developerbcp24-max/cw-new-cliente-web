import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceTelephonyComponent } from './service-telephony.component';

describe('ServiceTelephonyComponent', () => {
  let component: ServiceTelephonyComponent;
  let fixture: ComponentFixture<ServiceTelephonyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceTelephonyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceTelephonyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
