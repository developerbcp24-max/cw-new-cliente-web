import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterMobileFacialRecognitionComponent } from './register-mobile-facial-recognition.component';

describe('RegisterMobileFacialRecognitionComponent', () => {
  let component: RegisterMobileFacialRecognitionComponent;
  let fixture: ComponentFixture<RegisterMobileFacialRecognitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterMobileFacialRecognitionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterMobileFacialRecognitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
