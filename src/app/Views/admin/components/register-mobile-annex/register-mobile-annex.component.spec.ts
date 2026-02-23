import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterMobileAnnexComponent } from './register-mobile-annex.component';

describe('RegisterMobileAnnexComponent', () => {
  let component: RegisterMobileAnnexComponent;
  let fixture: ComponentFixture<RegisterMobileAnnexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterMobileAnnexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterMobileAnnexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
