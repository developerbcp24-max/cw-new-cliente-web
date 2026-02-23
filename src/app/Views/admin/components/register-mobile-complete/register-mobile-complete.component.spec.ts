import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterMobileCompleteComponent } from './register-mobile-complete.component';

describe('RegisterMobileCompleteComponent', () => {
  let component: RegisterMobileCompleteComponent;
  let fixture: ComponentFixture<RegisterMobileCompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterMobileCompleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterMobileCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
