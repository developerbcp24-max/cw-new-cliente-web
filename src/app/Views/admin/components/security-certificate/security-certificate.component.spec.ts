import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityCertificateComponent } from './security-certificate.component';

describe('SecurityCertificateComponent', () => {
  let component: SecurityCertificateComponent;
  let fixture: ComponentFixture<SecurityCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SecurityCertificateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecurityCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
