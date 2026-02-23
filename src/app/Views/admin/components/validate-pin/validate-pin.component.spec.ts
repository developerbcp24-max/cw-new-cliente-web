import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidatePinComponent } from './validate-pin.component';

describe('ValidatePinComponent', () => {
  let component: ValidatePinComponent;
  let fixture: ComponentFixture<ValidatePinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ValidatePinComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidatePinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
