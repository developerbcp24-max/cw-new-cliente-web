import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterMobileSignatureComponent } from './register-mobile-signature.component';

describe('RegisterMobileSignatureComponent', () => {
  let component: RegisterMobileSignatureComponent;
  let fixture: ComponentFixture<RegisterMobileSignatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterMobileSignatureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterMobileSignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
